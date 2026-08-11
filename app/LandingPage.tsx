"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadForm } from "./UploadForm";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ArrowsLeftRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowsLeftRight";
import { BuildingsIcon } from "@phosphor-icons/react/dist/ssr/Buildings";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { CalendarDotsIcon } from "@phosphor-icons/react/dist/ssr/CalendarDots";
import { ChartLineDownIcon } from "@phosphor-icons/react/dist/ssr/ChartLineDown";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop";
import { FileArrowUpIcon } from "@phosphor-icons/react/dist/ssr/FileArrowUp";
import { FlaskIcon } from "@phosphor-icons/react/dist/ssr/Flask";
import { HandshakeIcon } from "@phosphor-icons/react/dist/ssr/Handshake";
import { ReceiptIcon } from "@phosphor-icons/react/dist/ssr/Receipt";
import { StackIcon } from "@phosphor-icons/react/dist/ssr/Stack";
import { StorefrontIcon } from "@phosphor-icons/react/dist/ssr/Storefront";
import { TeaBagIcon } from "@phosphor-icons/react/dist/ssr/TeaBag";

const plans = [
  {
    name: "Кофе",
    price: "7 000 ₽",
    limit: "до 70 000 ₽ закупок в месяц",
    text: "Подбираем предложения обжарщиков под ваш объём и рабочий профиль зерна.",
  },
  {
    name: "Сиропы",
    price: "5 000 ₽",
    limit: "до 50 000 ₽ закупок в месяц",
    text: "Цена ниже крупного опта без обязательной закупки 150 бутылок.",
  },
  {
    name: "Чай",
    price: "4 000 ₽",
    limit: "до 20 000 ₽ закупок в месяц",
    text: "Согласованный ассортимент и ритм заказа под фактический расход.",
  },
  {
    name: "Всё вместе",
    price: "14 990 ₽",
    limit: "до 250 000 ₽ закупок в месяц",
    text: "Одна точка входа для трёх категорий и максимальный лимит для заведения.",
    featured: true,
  },
];

const syrupRows = [
  { product: "Ананас", series: "Фруктовая серия", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽", benefit: "выгода 196 ₽/бут" },
  { product: "Бабл-гам", series: "Десертная серия", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽", benefit: "выгода 195 ₽/бут" },
  { product: "Ваниль", series: "Классика", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽", benefit: "выгода 197 ₽/бут" },
];

const delivery = [
  { category: "Кофе", title: "Каждый понедельник", text: "Собираем предзаказ по понедельникам. Поставщик отгружает его в течение недели.", icon: CalendarCheckIcon },
  { category: "Сиропы", title: "2 раза в месяц", text: "Объединяем заявки и включаем заказ в ближайшую плановую поставку Herbarista в Казань.", icon: CalendarDotsIcon },
  { category: "Чай", title: "По согласованному графику", text: "Фиксируем периодичность вместе с вами и поставщиком под реальный расход.", icon: CalendarBlankIcon },
];

const processSteps = [
  { title: "Передайте структуру закупки", text: "Категории, позиции, текущие цены и примерный месячный объём.", icon: FileArrowUpIcon },
  { title: "Мы согласуем условия", text: "Собираем спрос, сопоставляем прайсы поставщиков и фиксируем подписочную цену.", icon: HandshakeIcon },
  { title: "Заказывайте нужный объём", text: "Передавайте заявку по графику. Товар оплачивается отдельно — по фактическому заказу.", icon: CalendarCheckIcon },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand${light ? " brand-light" : ""}`}>
      <span className="brand-mark" aria-hidden="true"><i /></span>
      <span>COFFEE NOSTRA</span>
    </span>
  );
}

function ActionLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <a className={`button ${secondary ? "button-ghost" : "button-primary"}`} href={href}>
      <span>{children}</span>
      <span className="button-icon" aria-hidden="true"><ArrowUpRightIcon size={17} weight="regular" /></span>
    </a>
  );
}

function ProcurementMap() {
  return (
    <div className="bezel procurement-shell reveal-item" aria-label="Coffee Nostra связывает поставщиков и заведение">
      <div className="procurement-core">
        <div className="procurement-head">
          <span>Контур закупки</span>
          <span className="status-dot">одна точка входа</span>
        </div>
        <div className="procurement-map">
          <div className="procurement-side supplier-side">
            <BuildingsIcon size={26} weight="light" aria-hidden="true" />
            <div><small>Сторона 01</small><strong>Поставщики</strong></div>
            <ul><li>обжарщики</li><li>чайные компании</li><li>Herbarista</li></ul>
          </div>
          <div className="flow-connector" aria-hidden="true"><i className="flow-stroke" /><ArrowsLeftRightIcon size={22} weight="light" /></div>
          <div className="nostra-node">
            <span className="node-index">CN</span>
            <HandshakeIcon size={34} weight="light" aria-hidden="true" />
            <strong>Coffee Nostra</strong>
            <p>собираем спрос<br />согласуем цену<br />планируем ритм</p>
          </div>
          <div className="flow-connector" aria-hidden="true"><i className="flow-stroke" /><ArrowRightIcon size={22} weight="light" /></div>
          <div className="procurement-side buyer-side">
            <StorefrontIcon size={26} weight="light" aria-hidden="true" />
            <div><small>Сторона 02</small><strong>Заведение</strong></div>
            <ul><li>нужный объём</li><li>единая заявка</li><li>плановая поставка</li></ul>
          </div>
        </div>
        <div className="procurement-metrics">
          <span><strong>3</strong> категории</span>
          <span><strong>1–2</strong> тестовых заказа</span>
          <span><strong>0</strong> обязательных коробок</span>
        </div>
      </div>
    </div>
  );
}

function EconomyGraph() {
  return (
    <section className="economy-band reveal-section" aria-labelledby="economy-title">
      <div className="economy-copy reveal-item">
        <span className="section-kicker"><ChartLineDownIcon size={14} weight="light" /> Экономика закупки</span>
        <h2 id="economy-title">Цена снижается.<br />Запас не растёт.</h2>
        <p>При обычной модели скидка появляется только вместе с объёмом. Мы объединяем спрос нескольких заведений и передаём вам специальные условия на нужный заказ.</p>
      </div>
      <div className="bezel graph-shell reveal-item">
        <div className="economy-chart" aria-label="Сравнение обычной и подписочной цены">
          <div className="economy-legend"><span><i />Обычный прайс</span><span><i />По подписке</span></div>
          <div className="economy-plot">
            <span className="economy-axis economy-axis-top">718 ₽</span>
            <span className="economy-axis economy-axis-bottom">522 ₽</span>
            <i className="economy-grid economy-grid-top" />
            <i className="economy-grid economy-grid-bottom" />
            <i className="economy-market economy-market-a" />
            <i className="economy-market economy-market-b" />
            <i className="economy-subscription" />
            <b className="economy-point economy-point-start" />
            <b className="economy-point economy-point-end" />
            <span className="economy-value economy-value-start">718 ₽</span>
            <span className="economy-value economy-value-end">656 ₽</span>
            <span className="economy-x economy-x-one">1</span>
            <span className="economy-x economy-x-fifty">50</span>
            <span className="economy-x economy-x-bulk">150+</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceStory() {
  return (
    <section className="price-story" id="prices">
      <div className="price-pin">
        <span className="section-kicker">Herbarista · пример расчёта</span>
        <h2>Не нужно покупать <span className="price-quantity">150</span> бутылок ради оптовой цены</h2>
        <p>Закупайте только необходимый объём на неделю или месяц. Экономию считаем от обычной цены за одну бутылку.</p>
        <a className="text-link" href="#request">Прислать закупочный лист <span><ArrowUpRightIcon size={17} /></span></a>
      </div>
      <div className="bezel price-shell reveal-item">
        <div className="price-rail" role="table" aria-label="Сравнительный прайс Herbarista">
          <div className="price-rail-head" role="row">
            <span role="columnheader">Продукт / вкус</span>
            <span role="columnheader">Обычная цена<br />от 1 шт.</span>
            <span role="columnheader">Крупный опт<br />от 150 шт.</span>
            <span className="price-accent-head" role="columnheader">По подписке</span>
          </div>
          {syrupRows.map((row) => (
            <div className="price-rail-row" role="row" key={row.product}>
              <div className="price-name" role="cell"><strong>{row.product}</strong><small>{row.series}</small></div>
              <span role="cell">{row.one}</span>
              <span role="cell">{row.bulk}</span>
              <div className="price-accent" role="cell"><strong>{row.subscription}</strong><small>{row.benefit}</small></div>
            </div>
          ))}
          <p className="price-note">Спеццена по подписке распространяется на весь каталог Herbarista.</p>
        </div>
      </div>
    </section>
  );
}

function BarSystem() {
  return (
    <div className="bar-system">
      <article className="bezel bar-card bar-card-main reveal-item">
        <div className="bar-card-core">
          <DropIcon size={30} weight="light" aria-hidden="true" />
          <span className="bar-code">01 / сиропы</span>
          <h3>Herbarista</h3>
          <p>Доступ к подписочной цене по всему каталогу без закупки 150 бутылок одного заказа.</p>
          <div className="bar-price-route"><span>718 ₽</span><i /><strong>522 ₽</strong></div>
        </div>
      </article>
      <article className="bezel bar-card reveal-item">
        <div className="bar-card-core">
          <TeaBagIcon size={28} weight="light" aria-hidden="true" />
          <span className="bar-code">02 / чай</span>
          <h3>Под ваш расход</h3>
          <p>Ассортимент и периодичность согласуем с поставщиком под барную карту.</p>
        </div>
      </article>
      <article className="bezel bar-card reveal-item">
        <div className="bar-card-core">
          <FlaskIcon size={28} weight="light" aria-hidden="true" />
          <span className="bar-code">03 / кордиалы</span>
          <h3>В одном расчёте</h3>
          <p>Добавим позиции в закупочный аудит и покажем итоговую экономику меню.</p>
        </div>
      </article>
    </div>
  );
}

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-line", { yPercent: 115, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out" });
      gsap.from(".hero-copy > *, .procurement-shell", { y: 44, opacity: 0, duration: 1, stagger: 0.1, delay: 0.35, ease: "power3.out" });
      gsap.from(".procurement-map > *", { y: 20, opacity: 0, duration: 0.75, stagger: 0.08, delay: 0.7, ease: "power3.out" });
      gsap.from(".flow-stroke", { scaleX: 0, duration: 0.9, stagger: 0.12, delay: 1, ease: "power3.inOut" });

      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        const items = section.querySelectorAll(".reveal-item");
        if (!items.length) return;
        gsap.from(items, {
          y: 54,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
      });

      gsap.to(".reveal-word", {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: ".reveal-copy", start: "top 86%", end: "bottom 46%", scrub: true },
      });
      gsap.fromTo(".economy-subscription", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".economy-chart", start: "top 82%", end: "bottom 58%", scrub: true },
      });
    });

    return () => media.revert();
  }, { scope: rootRef });

  const revealText = "Начните с 1–2 заказов без подписки, проверьте сервис и поставку, затем подключите тариф с 1 по 5 число следующего месяца.";

  return (
    <main id="top" ref={rootRef}>
      <a className="skip-link" href="#content">К содержанию</a>
      <header className="site-header">
        <a href="#top" aria-label="Coffee Nostra — начало страницы"><Brand /></a>
        <nav aria-label="Разделы страницы">
          <a href="#process">Как работает</a>
          <a href="#plans">Тарифы</a>
          <a href="#prices">Прайс</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="header-cta" href="#request">Прислать закупочный лист <span aria-hidden="true"><ArrowUpRightIcon size={15} /></span></a>
      </header>

      <div id="content">
        <section className="hero reveal-section">
          <span className="section-kicker hero-kicker"><ArrowsLeftRightIcon size={14} weight="light" /> Закупочная инфраструктура · Казань</span>
          <h1 aria-label="Закупайте напитки по ценам крупного опта, а не большими коробками.">
            <span className="hero-line">Закупайте напитки</span>
            <span className="hero-line">по ценам крупного опта,</span>
            <span className="hero-line">а не большими коробками.</span>
          </h1>
          <div className="hero-stage">
            <div className="hero-copy">
              <p>Coffee Nostra объединяет закупки заведений, согласует условия с поставщиками и передаёт вам специальную цену на необходимый объём.</p>
              <div className="hero-actions">
                <ActionLink href="#request">Прислать закупочный лист</ActionLink>
                <ActionLink href="#prices" secondary>Посмотреть сравнение цен</ActionLink>
              </div>
              <p className="role-note"><CheckCircleIcon size={17} weight="light" /> Мы не производим товар — мы организуем выгодную и предсказуемую закупку.</p>
            </div>
            <ProcurementMap />
          </div>
        </section>

        <div className="category-marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>ОБЪЕДИНЯЕМ СПРОС — СОГЛАСУЕМ ЦЕНУ — ПЛАНИРУЕМ ПОСТАВКУ — </span>
            <span>ОБЪЕДИНЯЕМ СПРОС — СОГЛАСУЕМ ЦЕНУ — ПЛАНИРУЕМ ПОСТАВКУ — </span>
          </div>
        </div>

        <EconomyGraph />

        <section className="chapter process reveal-section" id="process">
          <div className="chapter-head">
            <div><span className="section-kicker">Как работает подписка</span><h2>Одна заявка.<br />Три понятных этапа.</h2></div>
            <p>Подписка оплачивает доступ к специальным условиям. Товар вы оплачиваете отдельно — только по фактическому заказу.</p>
          </div>
          <div className="bezel process-shell reveal-item">
            <div className="process-list">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title}>
                    <span className="process-number">0{index + 1}</span>
                    <span className="process-icon"><Icon size={27} weight="light" aria-hidden="true" /></span>
                    <div><h3>{step.title}</h3><p>{step.text}</p></div>
                    <ArrowRightIcon size={21} weight="light" aria-hidden="true" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="chapter plans reveal-section" id="plans">
          <div className="chapter-head">
            <div><span className="section-kicker">Тарифы</span><h2>Условия под структуру закупки</h2></div>
            <p>Лимит — максимальная сумма закупок по спеццене в месяц, а не обязательный объём заказа.</p>
          </div>
          <div className="bezel plan-shell reveal-item">
            <div className="plan-bento">
              {plans.map((plan) => (
                <article className={`plan-card${plan.featured ? " plan-featured" : ""}`} key={plan.name}>
                  <div className="plan-head"><ReceiptIcon size={24} weight="light" aria-hidden="true" /><h3>{plan.name}</h3></div>
                  <div className="plan-price">{plan.price}<small>/ мес</small></div>
                  <strong className="plan-limit">{plan.limit}</strong>
                  <span className="plan-payment">+ оплата товара по факту заказа</span>
                  <span className="plan-saving">экономия — после расчёта по вашему прайсу</span>
                  <p>{plan.text}</p>
                  <a href="#request">Рассчитать тариф <span><ArrowUpRightIcon size={16} /></span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PriceStory />

        <section className="trial chapter reveal-section">
          <p className="reveal-copy">
            {revealText.split(" ").map((word, index) => <span className="reveal-word" key={`${word}-${index}`}>{word} </span>)}
          </p>
          <div className="trial-terms">
            <article className="bezel reveal-item"><div><span>01 / тест</span><h3>1–2 заказа без подписки</h3><p>Оплачиваете товар и доставку по обычным условиям и проверяете процесс в работе.</p></div></article>
            <article className="bezel reveal-item"><div><span>02 / подключение</span><h3>Оплата с 1 по 5 число</h3><p>Если формат подходит, подключаем выбранный тариф со следующего месяца.</p></div></article>
          </div>
        </section>

        <section className="chapter delivery reveal-section" id="delivery">
          <div className="chapter-head">
            <div><span className="section-kicker">Логистика по Казани</span><h2>Гарантированный ритм поставок</h2></div>
            <p>Мы координируем заявки и поставщиков, чтобы поддерживать наличие без избыточного склада.</p>
          </div>
          <div className="bezel delivery-shell reveal-item">
            <div className="delivery-line">
              {delivery.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.category}>
                    <Icon size={38} weight="light" aria-hidden="true" />
                    <span>{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="chapter hookah reveal-section">
          <div className="hookah-intro">
            <div><span className="section-kicker">Для кальянных баров</span><h2>Закупка ингредиентов как одна система</h2></div>
            <div><p>Сиропы, чай и кордиалы — в одном расчёте. Сравним текущую стоимость и предложим структуру закупки без избыточного объёма.</p><ActionLink href="#request" secondary>Рассчитать тариф</ActionLink></div>
          </div>
          <BarSystem />
        </section>

        <section className="request" id="request">
          <div className="request-copy">
            <span className="section-kicker section-kicker-light"><StackIcon size={14} weight="light" /> Закупочный аудит</span>
            <h2>Покажем разницу в цифрах</h2>
            <p>Пришлите текущий закупочный лист. B2B‑менеджер сопоставит ваши цены с условиями поставщиков и подписки.</p>
            <ul>
              <li>Текущая стоимость закупки</li>
              <li>Стоимость товара по подписке</li>
              <li>Чистая экономия за месяц</li>
            </ul>
          </div>
          <div className="bezel form-shell"><div className="form-shell-core"><UploadForm /></div></div>
        </section>
      </div>

      <footer>
        <div><Brand light /><p>Связываем заведения Казани с поставщиками кофе, чая и сиропов на специальных условиях.</p></div>
        <div className="footer-links"><a href="#process">Как работает</a><a href="#plans">Тарифы</a><a href="#prices">Прайс Herbarista</a><a href="#delivery">Поставки</a></div>
        <a className="footer-top" href="#top">Наверх <span><ArrowUpRightIcon size={15} /></span></a>
      </footer>
    </main>
  );
}
