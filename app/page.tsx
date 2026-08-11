const plans = [
  {
    number: "01",
    name: "Кофе",
    price: "7 000 ₽",
    limit: "до 70 000 ₽ закупок в месяц",
    note: "Стабильная цена на зерно без лишнего запаса на складе.",
    tone: "light",
  },
  {
    number: "02",
    name: "Сиропы",
    price: "5 000 ₽",
    limit: "до 50 000 ₽ закупок в месяц",
    note: "Цена ниже крупного опта — при вашем реальном объёме.",
    tone: "gold",
  },
  {
    number: "03",
    name: "Чай",
    price: "4 000 ₽",
    limit: "до 20 000 ₽ закупок в месяц",
    note: "Ассортимент и поставки под ритм вашего заведения.",
    tone: "sage",
  },
  {
    number: "04",
    name: "Всё вместе",
    price: "14 990 ₽",
    limit: "кофе + чай + сиропы",
    note: "Единая подписка и понятная закупка ключевых напитков.",
    tone: "dark",
    badge: "Выгоднее на 1 010 ₽",
  },
];

const syrupRows = [
  { group: "Группа 1", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽" },
  { group: "Группа 2", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽" },
  { group: "Группа 3", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽" },
];

const logistics = [
  {
    tag: "КОФЕ",
    title: "Предзаказ по понедельникам",
    text: "Собираем заявку в понедельник и отгружаем в течение недели.",
  },
  {
    tag: "СИРОПЫ",
    title: "Две поставки в месяц",
    text: "Плановые поставки в Казань — заранее включаем ваш заказ в ближайшую.",
  },
  {
    tag: "ЧАЙ",
    title: "По согласованному графику",
    text: "Фиксируем удобный ритм поставок под расход и склад заведения.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Coffee Nostra — к началу страницы">
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span>COFFEE NOSTRA</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#plans">Подписка</a>
          <a href="#syrups">Экономика</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="nav-cta" href="#request">Посчитать экономию <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> B2B-подписка · Казань</div>
          <h1>Закупайте напитки <em>по сильной цене,</em> а не большими коробками.</h1>
          <p>
            Кофе, чай и сиропы для заведений по специальным условиям —
            без необходимости замораживать деньги в запасах.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#request">Пришлите закупочный лист <span>→</span></a>
            <a className="text-link" href="#how">Как это работает <span>↓</span></a>
          </div>
        </div>

        <div className="hero-board" aria-label="Ключевые преимущества подписки">
          <div className="board-orbit orbit-one" />
          <div className="board-orbit orbit-two" />
          <div className="bean bean-one"><i /></div>
          <div className="bean bean-two"><i /></div>
          <div className="board-label">Ваша закупка<br />без переплаты</div>
          <div className="board-card card-a">
            <span>БЕЗ ПОДПИСКИ</span>
            <strong>объём диктует цену</strong>
          </div>
          <div className="board-card card-b">
            <span>С ПОДПИСКОЙ</span>
            <strong>цена работает на вас</strong>
          </div>
          <div className="board-seal"><small>ДЛЯ</small><b>HORECA</b><small>КАЗАНИ</small></div>
        </div>
      </section>

      <section className="manifesto">
        <p>Обычно лучшая цена требует большого объёма.</p>
        <strong>Мы отвязали цену от склада.</strong>
      </section>

      <section className="section how" id="how">
        <div className="section-heading">
          <div className="kicker">Как работает подписка</div>
          <h2>Платите за доступ к цене.<br />Закупаете только нужное.</h2>
        </div>
        <div className="steps">
          <article>
            <span>01</span>
            <div className="step-icon">↗</div>
            <h3>Выбираете направление</h3>
            <p>Кофе, чай, сиропы или единый комплекс для всей барной карты.</p>
          </article>
          <article>
            <span>02</span>
            <div className="step-icon">◇</div>
            <h3>Подключаете подписку</h3>
            <p>Оплата с 1 по 5 число месяца. Лимит — это объём закупок, а не обязательство.</p>
          </article>
          <article>
            <span>03</span>
            <div className="step-icon">✓</div>
            <h3>Заказываете по потребности</h3>
            <p>Не нужно добирать товар ради скидки или хранить лишние упаковки.</p>
          </article>
        </div>
      </section>

      <section className="section plans" id="plans">
        <div className="section-heading heading-row">
          <div>
            <div className="kicker">Выберите свой формат</div>
            <h2>Четыре простых тарифа</h2>
          </div>
          <p>Подписка оплачивается раз в месяц.<br />Товар — отдельно, по фактическому заказу.</p>
        </div>
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={`plan-card ${plan.tone}`} key={plan.name}>
              <div className="plan-top">
                <span>{plan.number}</span>
                {plan.badge && <small>{plan.badge}</small>}
              </div>
              <div>
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}<small>/ мес.</small></div>
                <div className="limit">{plan.limit}</div>
              </div>
              <p>{plan.note}</p>
              <a href="#request" aria-label={`Рассчитать тариф ${plan.name}`}>Рассчитать <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="syrups" id="syrups">
        <div className="syrup-intro">
          <div className="kicker kicker-light">Главный аргумент по сиропам</div>
          <h2>Цена ниже крупного опта. <em>Без 150 бутылок.</em></h2>
          <p>
            По подписке вы получаете цену ниже прайсового уровня закупки
            от 150 бутылок — даже если столько вашему заведению не нужно.
          </p>
          <div className="syrup-points">
            <div><span>—</span> не замораживаете деньги</div>
            <div><span>—</span> не занимаете склад</div>
            <div><span>—</span> не добираете лишние вкусы</div>
          </div>
        </div>

        <div className="price-panel">
          <div className="price-panel-head">
            <span>Примеры уровней прайса Herbarista</span>
            <small>₽ / бутылка</small>
          </div>
          <div className="price-table" role="table" aria-label="Сравнение цен на сиропы">
            <div className="price-row table-head" role="row">
              <span role="columnheader">Ценовая группа</span>
              <span role="columnheader">1 бутылка</span>
              <span role="columnheader">от 150</span>
              <span role="columnheader">Подписка</span>
            </div>
            {syrupRows.map((row) => (
              <div className="price-row" role="row" key={row.group}>
                <strong role="cell">{row.group}</strong>
                <span role="cell">{row.one}</span>
                <span role="cell">{row.bulk}</span>
                <b role="cell">{row.subscription}</b>
              </div>
            ))}
          </div>
          <div className="panel-note"><span>5000 ₽ / мес.</span> подписка на сиропы · закупки до 50 000 ₽</div>
        </div>
      </section>

      <section className="section trial">
        <div className="trial-number">1–2</div>
        <div className="trial-copy">
          <div className="kicker">Спокойный старт</div>
          <h2>Сначала попробуйте.<br />Потом решайте.</h2>
        </div>
        <div className="trial-detail">
          <p><strong>Первые 1–2 заказа — без подписки.</strong> Вы оплачиваете товар и доставку, проверяете продукт и сервис.</p>
          <p>Если вы пришли после 5 числа, тестируете до следующего месяца. Подписку подключаем и оплачиваем с 1 по 5 число.</p>
        </div>
      </section>

      <section className="section delivery" id="delivery">
        <div className="section-heading heading-row">
          <div>
            <div className="kicker">Логистика по Казани</div>
            <h2>Понятный ритм поставок</h2>
          </div>
          <p>Планируем заранее, чтобы у вас был товар —<br />и не было лишнего запаса.</p>
        </div>
        <div className="logistics-grid">
          {logistics.map((item, index) => (
            <article key={item.tag}>
              <div className="logistics-top"><span>{item.tag}</span><small>0{index + 1}</small></div>
              <div className="route-line"><i /><b /><i /></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hookah">
        <div className="hookah-main">
          <div className="kicker kicker-light">Отдельно для кальянных</div>
          <h2>Сиропы, чай и кордиалы — <em>для бара, а не для склада.</em></h2>
          <p>Соберите сильную безалкогольную карту и получайте профессиональные ингредиенты по условиям крупного опта без крупной закупки.</p>
          <a className="button button-cream" href="#request">Посчитать набор для кальянной <span>→</span></a>
        </div>
        <div className="hookah-list">
          <div><span>01</span><strong>Сиропы Herbarista</strong><small>от 522 ₽ по подписке</small></div>
          <div><span>02</span><strong>Чай</strong><small>поставка под ваш график</small></div>
          <div><span>03</span><strong>Кордиалы</strong><small>для авторской барной карты</small></div>
        </div>
      </section>

      <section className="request" id="request">
        <div className="request-copy">
          <div className="kicker kicker-light">Начнём с ваших цифр</div>
          <h2>Пришлите закупочный лист — <em>посчитаем экономию.</em></h2>
          <p>Подойдёт прайс поставщика, накладная или обычный список: позиции, объём и текущая цена.</p>
        </div>
        <div className="request-card">
          <span className="request-index">01</span>
          <div><strong>Соберите текущую закупку</strong><small>Кофе · чай · сиропы · кордиалы</small></div>
          <span className="request-arrow">↓</span>
          <span className="request-index">02</span>
          <div><strong>Отправьте менеджеру Coffee Nostra</strong><small>Фото, таблица или накладная</small></div>
          <span className="request-arrow">↓</span>
          <span className="request-index">03</span>
          <div><strong>Получите понятное сравнение</strong><small>Текущие расходы · подписка · чистая выгода</small></div>
          <a className="button button-gold" href="#top">Подготовить закупочный лист <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><i /></span><span>COFFEE NOSTRA</span></div>
        <p>B2B-подписка для заведений Казани</p>
        <a href="#top">Наверх ↑</a>
      </footer>
    </main>
  );
}
