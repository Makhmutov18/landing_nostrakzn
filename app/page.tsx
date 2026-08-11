import { UploadForm } from "./UploadForm";

const plans = [
  {
    index: "01",
    name: "Кофе",
    price: "7 000 ₽",
    limit: "до 70 000 ₽ закупок в месяц",
    text: "Регулярные закупки зерна по подписочной цене в рамках установленного лимита.",
  },
  {
    index: "02",
    name: "Сиропы",
    price: "5 000 ₽",
    limit: "до 50 000 ₽ закупок в месяц",
    text: "Цены ниже уровня крупного опта без обязательной закупки 150 бутылок.",
  },
  {
    index: "03",
    name: "Чай",
    price: "4 000 ₽",
    limit: "до 20 000 ₽ закупок в месяц",
    text: "Поставка согласованного ассортимента под фактический расход заведения.",
  },
  {
    index: "04",
    name: "Всё вместе",
    price: "14 990 ₽",
    limit: "кофе + чай + сиропы",
    text: "Единые условия на три категории и экономия 1 010 ₽ на стоимости подписок.",
    featured: true,
  },
];

const syrupRows = [
  { group: "Группа 1", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽" },
  { group: "Группа 2", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽" },
  { group: "Группа 3", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽" },
];

const delivery = [
  {
    index: "01",
    category: "Кофе",
    title: "Еженедельный предзаказ",
    schedule: "Каждый понедельник",
    text: "Заявка формируется в понедельник. Отгрузка — в течение недели.",
    icon: "week",
  },
  {
    index: "02",
    category: "Сиропы",
    title: "Плановые поставки",
    schedule: "2 раза в месяц",
    text: "Заказ включается в ближайшую плановую поставку Herbarista в Казань.",
    icon: "month",
  },
  {
    index: "03",
    category: "Чай",
    title: "По согласованному графику",
    schedule: "График фиксируем заранее",
    text: "Периодичность определяется под расход и доступный склад заведения.",
    icon: "calendar",
  },
];

function ProcessIcon({ type }: { type: "catalog" | "agreement" | "calendar" }) {
  return (
    <span className={`process-icon process-icon-${type}`} aria-hidden="true">
      <i /><b /><em />
    </span>
  );
}

function ScheduleIcon({ type }: { type: string }) {
  return (
    <span className={`schedule-icon schedule-icon-${type}`} aria-hidden="true">
      <i /><b /><em /><small />
    </span>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="header">
        <a className="brand" href="#top" aria-label="Coffee Nostra — начало страницы">
          <span className="brand-symbol" aria-hidden="true"><i /></span>
          <span>COFFEE NOSTRA</span>
        </a>
        <nav aria-label="Разделы страницы">
          <a href="#process">Как работает</a>
          <a href="#plans">Тарифы</a>
          <a href="#prices">Прайс</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="header-action" href="#request">Рассчитать экономию</a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="section-label">B2B-подписка для заведений Казани</div>
          <h1>Закупайте напитки по ценам крупного опта, а не большими коробками.</h1>
          <p className="hero-lead">
            Обычно лучшая цена требует большого объёма. Мы отвязали цену от объёма склада,
            заморозки денег и дефицита товаров.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#request">Пришлите закупочный лист</a>
            <a className="secondary-link" href="#prices">Посмотреть сравнение цен</a>
          </div>
          <dl className="hero-facts">
            <div><dt>3 категории</dt><dd>кофе, чай, сиропы</dd></div>
            <div><dt>1–2 заказа</dt><dd>тест без подписки</dd></div>
            <div><dt>Казань</dt><dd>плановая логистика</dd></div>
          </dl>
        </div>

        <div className="chart-card" aria-label="График зависимости цены от объёма закупки">
          <div className="chart-header">
            <div>
              <span>Экономика закупки</span>
              <h2>Цена против объёма</h2>
            </div>
            <small>₽ / бутылка</small>
          </div>
          <div className="chart-legend">
            <span><i className="legend-market" /> Обычный прайс</span>
            <span><i className="legend-subscription" /> По подписке</span>
          </div>
          <div className="chart-plot">
            <div className="y-label y-high">850</div>
            <div className="y-label y-mid">700</div>
            <div className="y-label y-low">520</div>
            <div className="grid-line grid-high" />
            <div className="grid-line grid-mid" />
            <div className="grid-line grid-low" />
            <div className="market-segment market-segment-a" />
            <div className="market-segment market-segment-b" />
            <div className="market-segment market-segment-c" />
            <div className="subscription-line" />
            <span className="chart-point point-a" />
            <span className="chart-point point-b" />
            <span className="chart-point point-c" />
            <span className="chart-point point-d" />
            <div className="subscription-note"><strong>Подписка</strong><span>цена ниже без роста запаса</span></div>
            <div className="x-label x-one">1</div>
            <div className="x-label x-fifty">50</div>
            <div className="x-label x-hundred">100</div>
            <div className="x-label x-bulk">150+</div>
          </div>
          <div className="chart-axis-title">Объём закупки, бутылки</div>
        </div>
      </section>

      <section className="section process" id="process">
        <div className="section-head">
          <div>
            <div className="section-label">Как работает подписка</div>
            <h2>Прозрачные этапы регулярных поставок</h2>
          </div>
          <p>Цена подписки фиксируется на месяц. Товар оплачивается отдельно — только по фактическому заказу.</p>
        </div>
        <div className="process-grid">
          <article>
            <div className="article-top"><span>01</span><ProcessIcon type="catalog" /></div>
            <h3>Выберите категории</h3>
            <p>Подключите кофе, чай, сиропы или комплекс из трёх направлений.</p>
          </article>
          <article>
            <div className="article-top"><span>02</span><ProcessIcon type="agreement" /></div>
            <h3>Зафиксируйте условия</h3>
            <p>Оплатите подписку с 1 по 5 число и получите доступ к специальным ценам.</p>
          </article>
          <article>
            <div className="article-top"><span>03</span><ProcessIcon type="calendar" /></div>
            <h3>Получайте поставки</h3>
            <p>Передавайте заявку по графику и закупайте только необходимый объём.</p>
          </article>
        </div>
      </section>

      <section className="section plans" id="plans">
        <div className="section-head">
          <div>
            <div className="section-label">Тарифы</div>
            <h2>Условия под структуру закупки</h2>
          </div>
          <p>Лимит тарифа — максимальная сумма закупок по специальным условиям, а не обязательный объём заказа.</p>
        </div>
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={`plan-card${plan.featured ? " featured" : ""}`} key={plan.name}>
              <div className="plan-meta"><span>{plan.index}</span>{plan.featured && <b>Комплексный тариф</b>}</div>
              <h3>{plan.name}</h3>
              <div className="plan-price">{plan.price}<small>в месяц</small></div>
              <div className="plan-limit">{plan.limit}</div>
              <p>{plan.text}</p>
              <a href="#request">Рассчитать тариф</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section prices" id="prices">
        <div className="section-head price-heading">
          <div>
            <div className="section-label">Реальные уровни прайса</div>
            <h2>Сравнительный прайс Herbarista: докажем экономию</h2>
          </div>
          <p>Сравните текущие закупки с нашим предложением. По подписке цена ниже уровня закупки от 150 бутылок.</p>
        </div>
        <div className="price-table" role="table" aria-label="Сравнительный прайс Herbarista">
          <div className="price-row price-row-head" role="row">
            <span role="columnheader">Ценовая группа</span>
            <span role="columnheader">1 бутылка</span>
            <span role="columnheader">От 150 бутылок</span>
            <span role="columnheader">По подписке</span>
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
        <div className="price-foot">
          <p><strong>5 000 ₽ в месяц</strong> — подписка на сиропы при закупках до 50 000 ₽.</p>
          <a href="#request">Сравнить мой закупочный лист</a>
        </div>
      </section>

      <section className="section trial">
        <div className="trial-heading">
          <div className="section-label">Для новых клиентов</div>
          <h2>Тестовые поставки: оцените сервис и продукт</h2>
          <p>Убедитесь в качестве, прежде чем подключать регулярную подписку.</p>
        </div>
        <div className="trial-grid">
          <article>
            <span className="trial-index">01</span>
            <div><h3>Первый этап</h3><strong>1–2 заказа без подписки</strong><p>Вы оплачиваете товар и доставку по обычным условиям и оцениваете продукт в работе.</p></div>
          </article>
          <article>
            <span className="trial-index">02</span>
            <div><h3>Подключение</h3><strong>Оплата с 1 по 5 число</strong><p>Если обращаетесь позже, тестируете до начала следующего месяца и затем подключаете тариф.</p></div>
          </article>
        </div>
      </section>

      <section className="section delivery" id="delivery">
        <div className="section-head">
          <div>
            <div className="section-label">Логистика по Казани</div>
            <h2>Гарантированный ритм поставок</h2>
          </div>
          <p>Планируем заказы заранее, чтобы поддерживать наличие без избыточного склада.</p>
        </div>
        <div className="delivery-grid">
          {delivery.map((item) => (
            <article key={item.category}>
              <div className="delivery-meta"><span>{item.index}</span><b>{item.category}</b></div>
              <ScheduleIcon type={item.icon} />
              <h3>{item.title}</h3>
              <strong>{item.schedule}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section hookah">
        <div className="hookah-copy">
          <div className="section-label">Для кальянных баров</div>
          <h2>Оптимизация барного меню кальянных баров</h2>
          <p>Соберите меню с высокой маржинальностью на основе сиропов, чая и кордиалов. Закупайте профессиональные ингредиенты без избыточного объёма.</p>
          <a className="button button-outline" href="#request">Рассчитать закупку для бара</a>
        </div>
        <div className="hookah-categories">
          <div><span>01</span><strong>Сиропы Herbarista</strong><small>от 522 ₽ по подписке</small></div>
          <div><span>02</span><strong>Чай</strong><small>поставка по согласованному графику</small></div>
          <div><span>03</span><strong>Кордиалы</strong><small>основа для авторских напитков</small></div>
        </div>
      </section>

      <section className="request" id="request">
        <div className="request-copy">
          <div className="section-label section-label-light">Расчёт экономики</div>
          <h2>Оптимизируйте ваши закупки прямо сейчас</h2>
          <p>Пришлите ваш текущий закупочный лист. Наш B2B-менеджер рассчитает оптимизацию и покажет разницу в цифрах.</p>
          <ul>
            <li>Текущая стоимость закупки</li>
            <li>Стоимость по подписке</li>
            <li>Чистая экономия за месяц</li>
          </ul>
        </div>
        <UploadForm />
      </section>

      <footer>
        <div className="footer-main">
          <div className="brand brand-light"><span className="brand-symbol" aria-hidden="true"><i /></span><span>COFFEE NOSTRA</span></div>
          <p>B2B-подписка на кофе, чай и сиропы для заведений Казани.</p>
        </div>
        <div className="footer-links">
          <a href="#process">Как работает</a>
          <a href="#plans">Тарифы</a>
          <a href="#prices">Прайс Herbarista</a>
          <a href="#delivery">Поставки</a>
        </div>
        <a className="footer-top" href="#top">Наверх</a>
      </footer>
    </main>
  );
}
