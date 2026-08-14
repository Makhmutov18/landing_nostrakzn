<?php
declare(strict_types=1);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = 12 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'xlsx', 'xls', 'csv', 'jpg', 'jpeg', 'png'];
const MAIL_HELPER = __DIR__ . '/send_mail.py';

function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function safe_filename(string $name): string
{
    $name = preg_replace('/[\r\n]+/', '', trim($name)) ?? '';
    $name = preg_replace('/[^a-zA-Z0-9._-]+/', '_', $name) ?? '';
    return substr($name ?: 'purchase-list', -140);
}

function send_email(string $contact, string $purchaseDetails, ?array $file): bool
{
    $payload = [
        'contact' => $contact,
        'purchaseDetails' => $purchaseDetails,
        'filePath' => $file !== null ? (string)$file['tmp_name'] : null,
        'fileName' => $file !== null ? safe_filename((string)$file['name']) : null,
        'mimeType' => $file !== null
            ? ((new finfo(FILEINFO_MIME_TYPE))->file((string)$file['tmp_name']) ?: 'application/octet-stream')
            : null,
    ];

    $process = @proc_open(
        ['/usr/bin/python3', MAIL_HELPER],
        [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
        $pipes,
        null,
        null,
        ['bypass_shell' => true],
    );
    if (!is_resource($process)) return false;

    fwrite($pipes[0], json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]);
    $error = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);

    if ($exitCode !== 0) {
        error_log('Nostra mail helper failed: ' . substr(trim($error), 0, 180));
        return false;
    }
    $result = json_decode($output, true);
    return is_array($result) && ($result['ok'] ?? false) === true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['message' => 'Метод не поддерживается.'], 405);
}

$requestSize = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($requestSize > MAX_REQUEST_SIZE) {
    respond(['message' => 'Файл превышает допустимый размер 10 МБ.'], 413);
}
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(['ok' => true]);
}

$contact = substr(trim((string)($_POST['contact'] ?? '')), 0, 300);
$purchaseDetails = substr(trim((string)($_POST['purchaseDetails'] ?? '')), 0, 3000);
$file = $_FILES['file'] ?? null;
$hasFile = is_array($file) && ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;

if ($contact === '') respond(['message' => 'Укажите контакт для ответа.'], 400);
if (!$hasFile && $purchaseDetails === '') {
    respond(['message' => 'Прикрепите файл или опишите примерный объём закупки.'], 400);
}

if ($hasFile) {
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        respond(['message' => 'Не удалось загрузить файл. Попробуйте ещё раз.'], 400);
    }
    if ((int)($file['size'] ?? 0) > MAX_FILE_SIZE) {
        respond(['message' => 'Файл превышает допустимый размер 10 МБ.'], 413);
    }
    $extension = strtolower(pathinfo((string)($file['name'] ?? ''), PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS, true)) {
        respond(['message' => 'Поддерживаются PDF, XLSX, XLS, CSV, JPG и PNG.'], 400);
    }
    if (!is_uploaded_file((string)($file['tmp_name'] ?? ''))) {
        respond(['message' => 'Не удалось проверить загруженный файл.'], 400);
    }
}

if (!send_email($contact, $purchaseDetails, $hasFile ? $file : null)) {
    respond(['message' => 'Не удалось отправить заявку. Попробуйте ещё раз через минуту.'], 502);
}

respond(['ok' => true, 'emailDelivered' => true]);
