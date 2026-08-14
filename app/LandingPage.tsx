"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadForm } from "./UploadForm";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
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

const plans = [
  {
    name: "Кофе",
    price: "7 000 ₽",
    limit: "до 70 000 ₽ закупок в месяц",
    saving: "Tasty Coffee: скидка 35% вместо 10% при заказе 10 кг",
    text: "Доступ к условиям уровня крупного опта и бесплатная плановая логистика.",
  },
  {
    name: "Сиропы",
    price: "5 000 ₽",
    limit: "до 50 000 ₽ закупок в месяц",
    saving: "Herbarista: выгода 195–197 ₽ с бутылки в примерах прайса",
    text: "Подписочная цена без необходимости закупать 150 бутылок за один раз.",
  },
  {
    name: "Чай",
    price: "4 000 ₽",
    limit: "до 20 000 ₽ закупок в месяц",
    saving: "Экономию считаем по вашему текущему закупочному листу",
    text: "Ассортимент и график заказа фиксируем под фактический расход заведения.",
  },
  {
    name: "Комплекс",
    price: "14 990 ₽",
    limit: "до 250 000 ₽ закупок в месяц",
    saving: "Кофе, чай и сиропы — в одном закупочном расчёте",
    text: "Единая подписка на три категории и максимальный лимит для заведения.",
    featured: true,
  },
];

const syrupRows = [
  { product: "Ананас", series: "Фруктовая серия", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽", benefit: "−196 ₽/бут." },
  { product: "Бабл-гам", series: "Десертная серия", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽", benefit: "−195 ₽/бут." },
  { product: "Ваниль", series: "Классика", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽", benefit: "−197 ₽/бут." },
];

const delivery = [
  { category: "Кофе", title: "Предзаказ по понедельникам", text: "Заказ поставщику уходит в начале недели. Отгрузка — в течение недели.", icon: CalendarCheckIcon },
  { category: "Сиропы", title: "Две поставки в месяц", text: "Заявка входит в ближайшую плановую поставку Herbarista в Казань.", icon: CalendarDotsIcon },
  { category: "Чай", title: "По согласованному графику", text: "Периодичность определяем вместе с заведением под реальный расход.", icon: CalendarBlankIcon },
];

const process = [
  { label: "Прайс", title: "Передайте структуру закупки", text: "Позиции, текущие цены и примерный месячный объём.", icon: FileArrowUpIcon },
  { label: "Расчёт", title: "Получите сравнение условий", text: "Покажем стоимость товара, подписки и чистую экономию.", icon: ReceiptIcon },
  { label: "Поставка", title: "Заказывайте нужный объём", text: "Товар оплачивается отдельно — только по фактическому заказу.", icon: CalendarCheckIcon },
];

function NostraLogo({ reversed = false }: { reversed?: boolean }) {
  return (
    // SVG wordmark is already optimized, transparent, and served as a static asset.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="nostra-logo"
      src={reversed ? "/nostra-wordmark-reversed.svg" : "/nostra-wordmark.svg"}
      width="176"
      height="45"
      alt="Nostra"
    />
  );
}

function ActionLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <a className={`button ${secondary ? "button-secondary" : "button-primary"}`} href={href}>
      <span>{children}</span>
      <span className="button-icon" aria-hidden="true"><ArrowUpRightIcon size={17} weight="regular" /></span>
    </a>
  );
}

function CommercialProof() {
  return (
    <div className="proof-card" data-reveal aria-label="Сравнение условий закупки Tasty Coffee при заказе 10 килограммов">
      <header className="proof-header">
        <div><strong>Tasty Coffee</strong><span>продукт производителя</span></div>
        <span className="proof-status">условия подтверждены</span>
      </header>
      <div className="proof-comparison">
        <article>
          <span>Напрямую</span>
          <strong>−10%</strong>
          <p>при заказе 10 кг</p>
          <small>доставка оплачивается отдельно</small>
        </article>
        <div className="proof-delta" aria-label="Разница 25 процентных пунктов">
          <ArrowRightIcon size={22} weight="light" />
          <span>+25 п.п.</span>
        </div>
        <article className="proof-nostra">
          <span>Через Nostra</span>
          <strong>−35%</strong>
          <p>при заказе 10 кг</p>
          <small>плановая логистика включена</small>
        </article>
      </div>
      <footer className="proof-footer">Тот же Tasty Coffee. Другие условия закупки.</footer>
    </div>
  );
}

function PartnerSection() {
  return (
    <section className="partner-section" aria-labelledby="partners-title">
      <div className="partner-statement" data-reveal>
        <span className="eyebrow">Роль Nostra</span>
        <h2 id="partners-title">Продукт остаётся у бренда.<br /><em>Условия — на нашей стороне.</em></h2>
        <p>Nostra не меняет названия, упаковку и репутацию производителей. Мы соединяем их предложение с рабочим объёмом конкретного заведения.</p>
      </div>
      <div className="partner-list" data-reveal>
        <article>
          <div><strong>Tasty Coffee</strong><span>кофе · официальный бренд производителя</span></div>
          <p><b>−35%</b><span>через Nostra</span></p>
        </article>
        <article>
          <div><strong>Herbarista</strong><span>сиропы и кордиалы · официальный бренд производителя</span></div>
          <p><b>от 522 ₽</b><span>по подписке</span></p>
        </article>
      </div>
    </section>
  );
}

function CoffeeSection() {
  return (
    <section className="coffee-section" id="coffee" aria-labelledby="coffee-title">
      <div className="section-heading" data-reveal>
        <span className="eyebrow">Tasty Coffee · подтверждённые условия</span>
        <h2 id="coffee-title">10 кг кофе.<br /><em>Скидка уровня 350 кг.</em></h2>
        <p>Напрямую заказ 10 кг даёт скидку 10% и платную доставку. Через Nostra — скидку 35% и бесплатную плановую логистику.</p>
      </div>
      <div className="coffee-data" data-reveal>
        <div className="discount-ladder" aria-label="Система скидок Tasty Coffee при прямой закупке">
          <div className="data-label"><span>Прямая закупка</span><span>Скидка</span></div>
          <div><span>от 10 кг</span><strong>10%</strong></div>
          <div><span>от 25 кг</span><strong>20%</strong></div>
          <div><span>от 50 кг</span><strong>30%</strong></div>
          <div><span>от 350 кг</span><strong>35%</strong></div>
        </div>
        <div className="coffee-fact">
          <span>Ваш заказ через Nostra</span>
          <strong>10 кг</strong>
          <b>−35%</b>
          <p>и бесплатная плановая логистика</p>
        </div>
      </div>
      <p className="data-disclaimer">Точная стоимость зависит от выбранного зерна и актуального прайса Tasty Coffee.</p>
    </section>
  );
}

function SyrupSection() {
  return (
    <section className="syrup-section" id="prices" aria-labelledby="syrup-title">
      <div className="section-heading syrup-heading" data-reveal>
        <span className="eyebrow">Herbarista · сравнительный прайс</span>
        <h2 id="syrup-title">Не покупайте 150 бутылок ради оптовой цены</h2>
        <p>Закупайте необходимый объём на неделю или месяц. Экономию считаем от обычной цены одной бутылки.</p>
      </div>
      <div className="price-table" role="table" aria-label="Сравнительный прайс Herbarista" data-reveal>
        <div className="price-table-head" role="row">
          <span role="columnheader">Продукт</span>
          <span role="columnheader">От 1 шт.</span>
          <span role="columnheader">От 150 шт.</span>
          <span role="columnheader">Через Nostra</span>
        </div>
        {syrupRows.map((row) => (
          <div className="price-table-row" role="row" key={row.product}>
            <div role="cell"><strong>{row.product}</strong><small>{row.series}</small></div>
            <span role="cell">{row.one}</span>
            <span role="cell">{row.bulk}</span>
            <div className="price-result" role="cell"><strong>{row.subscription}</strong><small>{row.benefit}</small></div>
          </div>
        ))}
      </div>
      <p className="data-disclaimer">Примеры построены по согласованному прайсу. Перед заказом используем актуальную редакцию каталога Herbarista.</p>
    </section>
  );
}

function BarSection() {
  return (
    <section className="bar-section" aria-labelledby="bar-title">
      <div className="section-heading" data-reveal>
        <span className="eyebrow">Для кальянных баров</span>
        <h2 id="bar-title">Ингредиенты для бара.<br /><em>Один закупочный расчёт.</em></h2>
        <p>Сиропы, чай и кордиалы собираются в одну понятную систему — с фактическим расходом, графиком и экономикой меню.</p>
        <ActionLink href="#request" secondary>Рассчитать тариф</ActionLink>
      </div>
      <div className="bar-cards" data-reveal>
        <article><FlaskIcon size={30} weight="light" /><h3>Сиропы Herbarista</h3><p>Подписочная цена по каталогу без избыточного разового объёма.</p></article>
        <article><TeaBagIcon size={30} weight="light" /><h3>Чай</h3><p>Ассортимент и периодичность поставок под фактический расход.</p></article>
        <article><StorefrontIcon size={30} weight="light" /><h3>Кордиалы</h3><p>Добавим позиции в аудит и посчитаем итоговую экономику бара.</p></article>
      </div>
    </section>
  );
}

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-word", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power4.out" });
      gsap.from(".hero-intro > *, .proof-card", { y: 34, opacity: 0, duration: 0.85, stagger: 0.08, delay: 0.28, ease: "power3.out" });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => {
        if (item.closest(".hero")) return;
        gsap.from(item, {
          y: 46,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 86%", once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <main id="top" ref={rootRef}>
      <a className="skip-link" href="#content">К содержанию</a>
      <header className="site-header">
        <a className="header-logo" href="#top" aria-label="Nostra — начало страницы"><NostraLogo /></a>
        <nav aria-label="Разделы страницы">
          <a href="#process">Как работаем</a>
          <a href="#plans">Тарифы</a>
          <a href="#coffee">Кофе</a>
          <a href="#prices">Herbarista</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="header-cta" href="#request">Прислать закупочный лист <ArrowUpRightIcon size={15} /></a>
      </header>

      <div id="content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-title-wrap">
            <span className="eyebrow hero-eyebrow">Коммерческий партнёр для заведений · Казань</span>
            <h1 id="hero-title" aria-label="Те же бренды. Лучше условия.">
              <span className="hero-line"><span className="hero-word">Те же бренды.</span></span>
              <span className="hero-line hero-line-accent"><span className="hero-word">Лучше условия.</span></span>
            </h1>
          </div>
          <div className="hero-grid">
            <div className="hero-intro">
              <p>Кофе, сиропы и чай для заведений на специальных коммерческих условиях. Nostra не производит продукт — мы помогаем покупать знакомые бренды выгоднее.</p>
              <div className="hero-actions">
                <ActionLink href="#request">Прислать закупочный лист</ActionLink>
                <ActionLink href="#coffee" secondary>Посмотреть условия</ActionLink>
              </div>
              <ul className="hero-facts" aria-label="Ключевые условия">
                <li><strong>2</strong><span>подтверждённых бренда</span></li>
                <li><strong>1–2</strong><span>тестовых заказа</span></li>
                <li><strong>1</strong><span>закупочный расчёт</span></li>
              </ul>
            </div>
            <CommercialProof />
          </div>
        </section>

        <div className="brand-strip" aria-hidden="true">
          <span>ТОТ ЖЕ ПРОДУКТ · ДРУГИЕ УСЛОВИЯ · ПОНЯТНАЯ ЗАКУПКА</span>
          <span>ТОТ ЖЕ ПРОДУКТ · ДРУГИЕ УСЛОВИЯ · ПОНЯТНАЯ ЗАКУПКА</span>
        </div>

        <PartnerSection />

        <section className="process-section" id="process" aria-labelledby="process-title">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Как работаем</span>
            <h2 id="process-title">От закупочного листа<br />до плановой поставки</h2>
            <p>Подписка оплачивает доступ к специальным условиям. Товар оплачивается отдельно — по факту заказа.</p>
          </div>
          <div className="process-grid" data-reveal>
            {process.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label}>
                  <Icon size={30} weight="light" aria-hidden="true" />
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="plans-section" id="plans" aria-labelledby="plans-title">
          <div className="section-heading plans-heading" data-reveal>
            <span className="eyebrow">Подписка</span>
            <h2 id="plans-title">Условия под структуру закупки</h2>
            <p>Лимит — максимальная сумма закупок по спеццене в месяц, а не обязательный объём заказа.</p>
          </div>
          <div className="plans-grid" data-reveal>
            {plans.map((plan) => (
              <article className={plan.featured ? "plan-card plan-featured" : "plan-card"} key={plan.name}>
                <div className="plan-title"><span>{plan.name}</span>{plan.featured ? <b>Три категории</b> : null}</div>
                <strong className="plan-price">{plan.price}<small>/ мес.</small></strong>
                <span className="plan-payment">+ оплата товара по факту заказа</span>
                <b className="plan-limit">{plan.limit}</b>
                <span className="plan-saving">{plan.saving}</span>
                <p>{plan.text}</p>
                <a href="#request">Рассчитать тариф <ArrowUpRightIcon size={16} /></a>
              </article>
            ))}
          </div>
        </section>

        <CoffeeSection />
        <SyrupSection />

        <section className="operations-section" id="delivery" aria-labelledby="operations-title">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">Простой старт и логистика</span>
            <h2 id="operations-title">Проверьте сервис.<br /><em>Затем подключайте подписку.</em></h2>
          </div>
          <div className="trial-grid" data-reveal>
            <article><strong>1–2 заказа</strong><span>без подписки</span><p>Вы оплачиваете товар и доставку по обычным условиям и оцениваете процесс.</p></article>
            <article><strong>1–5 число</strong><span>подключение тарифа</span><p>Если формат подходит, подписка начинает действовать со следующего месяца.</p></article>
          </div>
          <div className="delivery-grid" data-reveal>
            {delivery.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.category}>
                  <Icon size={32} weight="light" aria-hidden="true" />
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <BarSection />

        <section className="request-section" id="request" aria-labelledby="request-title">
          <div className="request-copy" data-reveal>
            <span className="eyebrow eyebrow-light">Закупочный аудит</span>
            <h2 id="request-title">Покажем разницу<br />в цифрах</h2>
            <p>Пришлите текущий закупочный лист. B2B‑менеджер сопоставит ваши цены с условиями поставщиков и подписки.</p>
            <ul>
              <li><CheckIcon size={18} /> Текущая стоимость закупки</li>
              <li><CheckIcon size={18} /> Стоимость товара по подписке</li>
              <li><CheckIcon size={18} /> Чистая экономия за месяц</li>
            </ul>
          </div>
          <div className="request-form" data-reveal><UploadForm /></div>
        </section>
      </div>

      <footer className="site-footer">
        <div><NostraLogo reversed /><p>Те же бренды. Лучше условия.</p></div>
        <nav aria-label="Навигация в подвале"><a href="#process">Как работаем</a><a href="#plans">Тарифы</a><a href="#coffee">Tasty Coffee</a><a href="#prices">Herbarista</a></nav>
        <a className="footer-top" href="#top">Наверх <ArrowUpRightIcon size={15} /></a>
      </footer>
    </main>
  );
}
