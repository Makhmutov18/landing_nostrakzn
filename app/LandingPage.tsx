"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadForm } from "./UploadForm";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { CalendarDotsIcon } from "@phosphor-icons/react/dist/ssr/CalendarDots";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { FileArrowUpIcon } from "@phosphor-icons/react/dist/ssr/FileArrowUp";
import { FlaskIcon } from "@phosphor-icons/react/dist/ssr/Flask";
import { ReceiptIcon } from "@phosphor-icons/react/dist/ssr/Receipt";
import { StorefrontIcon } from "@phosphor-icons/react/dist/ssr/Storefront";
import { TeaBagIcon } from "@phosphor-icons/react/dist/ssr/TeaBag";

gsap.registerPlugin(ScrollTrigger);

type Plan = {
  id: string;
  name: string;
  tag?: string;
  price: string;
  limit: string;
  proof: string;
  text: string;
  featured?: boolean;
};

// Source of truth for numbers: brand/claims.json
const bundlePlans: Plan[] = [
  {
    id: "basic-70",
    name: "Базовый",
    tag: "Кофе · чай · сиропы",
    price: "9\u202f900",
    limit: "до 70 000 ₽ закупок в месяц",
    proof: "Общий лимит на три категории",
    text: "Закупочные цены на кофе, чай и сиропы и бесплатная доставка заказов.",
    featured: true,
  },
  {
    id: "basic-250",
    name: "Базовый",
    tag: "Кофе · чай · сиропы",
    price: "14\u202f900",
    limit: "до 250 000 ₽ закупок в месяц",
    proof: "Для заведений с большим оборотом",
    text: "Те же условия, что в Базовом, с лимитом закупок до 250 000 ₽.",
  },
  {
    id: "extended-250",
    name: "Расширенный",
    tag: "Кофе · чай · сиропы",
    price: "19\u202f900",
    limit: "до 250 000 ₽ закупок в месяц",
    proof: "Условия согласуем индивидуально",
    text: "Расширенный пакет для крупного объёма закупок.",
  },
];

const singlePlans: Plan[] = [
  {
    id: "coffee",
    name: "Только кофе",
    price: "7\u202f000",
    limit: "до 70 000 ₽ закупок в месяц",
    proof: "Tasty Coffee: скидка 35% через Nostra",
    text: "Свежая обжарка каждую неделю и бесплатная плановая логистика.",
  },
  {
    id: "tea",
    name: "Только чай",
    price: "4\u202f000",
    limit: "до 20 000 ₽ закупок в месяц",
    proof: "Закупочные цены на чай",
    text: "Ассортимент и график фиксируем под расход заведения.",
  },
  {
    id: "syrups",
    name: "Только сиропы",
    price: "5\u202f000",
    limit: "до 20 000 ₽ закупок в месяц",
    proof: "Herbarista: выгода 195–197 ₽ с бутылки",
    text: "Цена ниже крупного опта без разовой закупки 150 бутылок.",
  },
];

const syrupRows = [
  { product: "Ананас", series: "Фруктовая серия", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽", benefit: "выгода 196 ₽/бут." },
  { product: "Бабл-гам", series: "Десертная серия", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽", benefit: "выгода 195 ₽/бут." },
  { product: "Ваниль", series: "Классика", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽", benefit: "выгода 197 ₽/бут." },
];

const delivery = [
  { category: "Кофе", title: "Каждый понедельник", text: "Предзаказ поставщику. Отгрузка — в течение недели.", icon: CalendarCheckIcon },
  { category: "Сиропы", title: "2 раза в месяц", text: "Две плановые поставки Herbarista в Казань.", icon: CalendarDotsIcon },
  { category: "Чай", title: "По графику", text: "Периодичность согласуем под реальный расход.", icon: CalendarBlankIcon },
];

const process = [
  { label: "Закупочный лист", title: "Передайте фактические позиции и цены", text: "Файл или короткое описание месячного объёма.", icon: FileArrowUpIcon },
  { label: "Расчёт", title: "Получите сравнение в цифрах", text: "Товар, подписка и чистая экономия за месяц.", icon: ReceiptIcon },
  { label: "Поставка", title: "Заказывайте нужный объём", text: "Оплачивайте только фактически заказанный товар.", icon: CalendarCheckIcon },
];

const tickerItems = [
  "Tasty Coffee — скидка 35%",
  "Herbarista — от 522 ₽",
  "Кофе, чай и сиропы — от 9 900 ₽ в месяц",
  "Плановая логистика по Казани",
  "Товар оплачивается по факту",
];

function NostraLogo({ reversed = false }: { reversed?: boolean }) {
  return (
    // The production wordmark is a compact, path-based SVG.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="nostra-logo"
      src={reversed ? "/nostra-wordmark-reversed.svg" : "/nostra-wordmark.svg"}
      width="176"
      height="74"
      alt="Nostra"
    />
  );
}

function ActionLink({
  href,
  children,
  inverted = false,
}: {
  href: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <a className={inverted ? "action-link action-link-inverted" : "action-link"} href={href}>
      <span>{children}</span>
      <span className="action-link-icon" aria-hidden="true">
        <ArrowUpRightIcon size={16} weight="regular" />
      </span>
    </a>
  );
}

function DealTicker() {
  const repeatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="deal-ticker poster-red" aria-label={tickerItems.join(". ")}>
      <div className="deal-ticker-track" aria-hidden="true">
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}<i />
          </span>
        ))}
      </div>
    </div>
  );
}

function VoiceSection() {
  return (
    <section className="voice-section poster-dark" aria-labelledby="voice-title">
      <div className="voice-main" data-reveal>
        <span className="micro-label micro-label-light">Голос Nostra</span>
        <h2 id="voice-title" className="display-title">
          Факты.<br />
          Условия.<br />
          Ваша выгода.
        </h2>
        <p>Коммерческий голос, которому доверяют.</p>
      </div>
      <div className="voice-principles" data-reveal>
        <p>Находим лучшие условия.</p>
        <p>Упрощаем сложные закупки.</p>
        <p>Работаем в интересах вашего бизнеса.</p>
      </div>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="partner-section poster-light" aria-labelledby="partners-title">
      <header className="partner-heading" data-reveal>
        <span className="micro-label">Собрендинг / принцип</span>
        <h2 id="partners-title">
          Сильные бренды —<br />
          <span>выгодные условия.</span>
        </h2>
        <p>Nostra связывает производителя и заведение, не присваивая продукт и его репутацию.</p>
      </header>
      <div className="partner-ledger" data-reveal>
        <article>
          <div className="partner-brand">
            <span>Кофе</span>
            <strong>Tasty Coffee</strong>
            <small>бренд производителя</small>
          </div>
          <div className="partner-condition">
            <strong>−35%</strong>
            <span>через Nostra</span>
          </div>
        </article>
        <article>
          <div className="partner-brand">
            <span>Сиропы и кордиалы</span>
            <strong>Herbarista</strong>
            <small>бренд производителя</small>
          </div>
          <div className="partner-condition">
            <strong>от 522 ₽</strong>
            <span>через Nostra</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className={plan.featured ? "plan-panel plan-panel-featured" : "plan-panel"}>
      <header>
        <span>{plan.name}</span>
        {plan.tag ? <b>{plan.tag}</b> : null}
      </header>
      <div className="plan-price"><strong>{plan.price}</strong><span>₽ / мес.</span></div>
      <small>+ оплата товара по факту заказа</small>
      <div className="plan-terms">
        <b>{plan.limit}</b>
        <em>{plan.proof}</em>
        <p>{plan.text}</p>
      </div>
      <a href="#request">
        <span>Рассчитать тариф</span>
        <span className="plan-link-icon" aria-hidden="true"><ArrowUpRightIcon size={15} /></span>
      </a>
    </article>
  );
}

function PlansSection() {
  return (
    <section className="plans-section poster-stone" id="plans" aria-labelledby="plans-title">
      <header className="section-intro" data-reveal>
        <span className="micro-label">Подписка</span>
        <h2 id="plans-title" className="display-title">Условия под<br />вашу закупку.</h2>
        <p>Лимит — максимальная сумма закупок по спеццене в месяц, а не обязательный объём. Подписка оплачивается с 1 по 5 число месяца.</p>
      </header>
      <div className="plans-group" data-reveal>
        <div className="plans-group-head">
          <h3>Пакет: кофе, чай и сиропы</h3>
          <p>Три отдельные подписки стоят 16 000 ₽ в месяц. В пакете — от 9 900 ₽, лимит общий на все категории.</p>
        </div>
        <div className="plans-layout">
          {bundlePlans.map((plan) => <PlanCard plan={plan} key={plan.id} />)}
        </div>
      </div>
      <div className="plans-group" data-reveal>
        <div className="plans-group-head">
          <h3>Одна категория</h3>
          <p>Если заведению нужен только кофе, только чай или только сиропы.</p>
        </div>
        <div className="plans-layout">
          {singlePlans.map((plan) => <PlanCard plan={plan} key={plan.id} />)}
        </div>
      </div>
    </section>
  );
}

function CoffeeSection() {
  return (
    <section className="coffee-section" id="coffee" aria-labelledby="coffee-title">
      <div className="coffee-poster poster-red" data-reveal>
        <span className="micro-label micro-label-light">Tasty Coffee / подтверждённые условия</span>
        <h2 id="coffee-title" className="display-title">Условия уровня<br />крупного опта.</h2>
        <strong className="coffee-number">−35%</strong>
        <footer>
          <p>на подтверждённый ассортимент через Nostra</p>
          <span>плановая логистика включена</span>
        </footer>
      </div>
      <div className="coffee-facts poster-dark" data-reveal>
        <span className="micro-label micro-label-light">Условия через Nostra</span>
        <strong className="coffee-facts-lead">Не меняйте кофе.<br />Поменяйте условия.</strong>
        <div className="coffee-terms">
          <article>
            <span>Скидка</span>
            <strong>35%</strong>
            <p>На подтверждённый ассортимент Tasty Coffee.</p>
          </article>
          <article>
            <span>Уровень условий</span>
            <strong>350 кг</strong>
            <p>Цена соответствует максимальной оптовой колонке производителя.</p>
          </article>
          <article>
            <span>Логистика</span>
            <strong>Включена</strong>
            <p>Плановые поставки в Казань без отдельной оплаты доставки.</p>
          </article>
        </div>
        <small>Точная стоимость зависит от выбранного зерна и актуального прайса производителя.</small>
      </div>
    </section>
  );
}

function SyrupSection() {
  return (
    <section className="syrup-section poster-light" id="prices" aria-labelledby="syrup-title">
      <header className="syrup-heading" data-reveal>
        <div>
          <span className="micro-label">Herbarista / сравнительный прайс</span>
          <h2 id="syrup-title" className="display-title">Не покупайте<br />150 бутылок.</h2>
        </div>
        <p>Цена по подписке ниже крупного опта. Выгоду считаем от обычной цены одной бутылки.</p>
      </header>
      <div className="price-ledger" role="table" aria-label="Сравнительный прайс Herbarista" data-reveal>
        <div className="price-ledger-head" role="row">
          <span role="columnheader">Продукт / вкус</span>
          <span role="columnheader">Обычная цена</span>
          <span role="columnheader">От 150 шт.</span>
          <span role="columnheader">Через Nostra</span>
        </div>
        {syrupRows.map((row) => (
          <div className="price-ledger-row" role="row" key={row.product}>
            <div role="cell"><strong>{row.product}</strong><small>{row.series}</small></div>
            <span role="cell">{row.one}</span>
            <span role="cell">{row.bulk}</span>
            <div className="price-ledger-result" role="cell">
              <strong>{row.subscription}</strong>
              <small>{row.benefit}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="legal-note">Примеры построены по согласованному прайсу. Перед заказом используем актуальную редакцию каталога Herbarista.</p>
    </section>
  );
}

function OperationsSection() {
  return (
    <section className="operations-section" id="delivery" aria-labelledby="operations-title">
      <div className="start-panel poster-stone" data-reveal>
        <span className="micro-label">Простой старт</span>
        <h2 id="operations-title" className="display-title">Сначала<br />проверьте.</h2>
        <div className="start-terms">
          <article><strong>1–2</strong><span>заказа без подписки</span><p>Оплачиваете товар и доставку по обычным условиям.</p></article>
          <article><strong>1–5</strong><span>число месяца</span><p>Подключаете тариф со следующего месяца, если всё устроило.</p></article>
        </div>
      </div>
      <div className="delivery-panel poster-light" data-reveal>
        <span className="micro-label">Логистика по Казани</span>
        <h2 className="display-title">Понятный<br />ритм.</h2>
        <div className="delivery-list">
          {delivery.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.category}>
                <Icon size={25} weight="light" aria-hidden="true" />
                <div><span>{item.category}</span><strong>{item.title}</strong><p>{item.text}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BarSection() {
  return (
    <section className="bar-section poster-dark" aria-labelledby="bar-title">
      <header data-reveal>
        <span className="micro-label micro-label-light">Для кальянных баров</span>
        <h2 id="bar-title" className="display-title">Барное меню.<br />Один расчёт.</h2>
        <p>Сиропы, чай и кордиалы собираются в понятную систему под фактический расход заведения.</p>
        <ActionLink href="#request" inverted>Рассчитать тариф</ActionLink>
      </header>
      <div className="bar-ledger" data-reveal>
        <article><FlaskIcon size={28} weight="light" /><span>Herbarista</span><strong>Сиропы</strong><p>Спеццена без избыточного разового объёма.</p></article>
        <article><TeaBagIcon size={28} weight="light" /><span>По графику</span><strong>Чай</strong><p>Поставки под фактический расход.</p></article>
        <article><StorefrontIcon size={28} weight="light" /><span>В одном аудите</span><strong>Кордиалы</strong><p>Считаем в общей экономике бара.</p></article>
      </div>
    </section>
  );
}

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-proof-number", {
        scale: 0.84,
        transformOrigin: "left center",
        duration: 1.1,
        delay: 0.42,
        clearProps: "transform",
        ease: "expo.out",
      });
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: "top top", end: "max", scrub: 0.25 },
      });
      gsap.to(".deal-ticker-track", {
        xPercent: -50,
        duration: 28,
        repeat: -1,
        ease: "none",
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <main id="top" ref={rootRef}>
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#content">К содержанию</a>
      <header className="site-header">
        <a href="#top" aria-label="Nostra — начало страницы"><NostraLogo /></a>
        <nav aria-label="Разделы страницы">
          <a href="#process">Как работаем</a>
          <a href="#plans">Тарифы</a>
          <a href="#coffee">Кофе</a>
          <a href="#prices">Сиропы</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="header-action" href="#request">
          <span>Прислать закупочный лист</span>
          <span className="header-action-icon" aria-hidden="true"><ArrowUpRightIcon size={16} /></span>
        </a>
      </header>

      <div id="content">
        <section className="hero poster-light" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="micro-label">Коммерческий партнёр / HoReCa / Казань</span>
            <h1 id="hero-title" className="hero-display" aria-label="Хороший продукт вы уже нашли. Покупайте его выгоднее.">
              <span>Хороший продукт</span>
              <span>вы уже нашли.</span>
              <span className="accent">Покупайте его</span>
              <span className="accent">выгоднее.</span>
            </h1>
            <div className="hero-copy-bottom">
              <p>Nostra не производит кофе, чай или сиропы. Мы помогаем заведениям покупать уже знакомые бренды на лучших коммерческих условиях.</p>
              <ActionLink href="#request">Прислать закупочный лист</ActionLink>
            </div>
          </div>
          <aside className="hero-proof" aria-label="Подтверждённое условие Tasty Coffee">
            <header><span>Бренд производителя</span><strong>Tasty Coffee</strong></header>
            <div className="hero-proof-number">−35%</div>
            <p>скидка через Nostra</p>
            <footer><span>условия через</span><b>Nostra</b></footer>
          </aside>
        </section>

        <DealTicker />

        <VoiceSection />
        <PartnerSection />

        <section className="process-section poster-light" id="process" aria-labelledby="process-title">
          <header className="section-intro" data-reveal>
            <span className="micro-label">Как это работает</span>
            <h2 id="process-title" className="display-title">Одна заявка.<br />Три действия.</h2>
            <p>Подписка даёт доступ к специальным условиям. Товар оплачивается отдельно — по факту заказа.</p>
          </header>
          <div className="process-ledger" data-reveal>
            {process.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label}>
                  <Icon size={28} weight="light" aria-hidden="true" />
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <PlansSection />
        <CoffeeSection />
        <SyrupSection />
        <OperationsSection />
        <BarSection />

        <section className="request-section poster-red" id="request" aria-labelledby="request-title">
          <div className="request-copy" data-reveal>
            <span className="micro-label micro-label-light">Закупочный аудит</span>
            <h2 id="request-title" className="display-title">Покажем<br />разницу<br />в цифрах.</h2>
            <p>Пришлите текущий закупочный лист. B2B‑менеджер сопоставит ваши цены с условиями поставщиков и подписки.</p>
            <ul>
              <li><CheckIcon size={17} /> Текущая стоимость закупки</li>
              <li><CheckIcon size={17} /> Стоимость товара по подписке</li>
              <li><CheckIcon size={17} /> Чистая экономия за месяц</li>
            </ul>
            <p className="request-direct">
              Удобнее напрямую? <a href="https://t.me/Emakhmutov1" target="_blank" rel="noopener noreferrer">Telegram @Emakhmutov1</a> · <a href="tel:+79019478742">+7 901 947-87-42</a>
            </p>
          </div>
          <div className="request-form" data-reveal><UploadForm /></div>
        </section>
      </div>

      <footer className="site-footer">
        <div><NostraLogo reversed /><p>Те же бренды. Лучше условия.</p></div>
        <address className="footer-contacts" aria-label="Контакты">
          <a href="tel:+79019478742">+7 901 947-87-42</a>
          <a href="https://t.me/Emakhmutov1" target="_blank" rel="noopener noreferrer">Telegram @Emakhmutov1</a>
          <a href="mailto:nostra.kzn@yandex.com">nostra.kzn@yandex.com</a>
          <a href="/privacy.html">Политика обработки персональных данных</a>
        </address>
        <a href="#top">Наверх <ArrowUpRightIcon size={14} /></a>
      </footer>
    </main>
  );
}
