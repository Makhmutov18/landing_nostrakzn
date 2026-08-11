"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadForm } from "./UploadForm";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { CalendarDotsIcon } from "@phosphor-icons/react/dist/ssr/CalendarDots";
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop";
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr/FileText";
import { FlaskIcon } from "@phosphor-icons/react/dist/ssr/Flask";
import { FolderOpenIcon } from "@phosphor-icons/react/dist/ssr/FolderOpen";
import { TeaBagIcon } from "@phosphor-icons/react/dist/ssr/TeaBag";

const plans = [
  {
    name: "Кофе",
    price: "7 000 ₽",
    limit: "до 70 000 ₽ закупок в месяц",
    text: "Регулярные закупки зерна по подписочной цене в рамках установленного лимита.",
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
    text: "Согласованный ассортимент под фактический расход заведения.",
  },
  {
    name: "Всё вместе",
    price: "14 990 ₽",
    limit: "до 250 000 ₽ закупок в месяц",
    text: "Единая подписка на три категории и максимальный лимит для заведения.",
    featured: true,
  },
];

const syrupRows = [
  { product: "Ананас", series: "Фруктовая серия", one: "718 ₽", bulk: "656 ₽", subscription: "522 ₽", benefit: "выгода 196 ₽/бут" },
  { product: "Бабл-гам", series: "Десертная серия", one: "783 ₽", bulk: "721 ₽", subscription: "588 ₽", benefit: "выгода 195 ₽/бут" },
  { product: "Ваниль", series: "Классика", one: "836 ₽", bulk: "774 ₽", subscription: "639 ₽", benefit: "выгода 197 ₽/бут" },
];

const delivery = [
  { category: "Кофе", title: "Каждый понедельник", text: "Предзаказ по понедельникам, отгрузка — в течение недели.", icon: CalendarCheckIcon },
  { category: "Сиропы", title: "2 раза в месяц", text: "Заказ включается в ближайшую плановую поставку Herbarista в Казань.", icon: CalendarDotsIcon },
  { category: "Чай", title: "По согласованному графику", text: "Периодичность фиксируем под расход и доступный склад заведения.", icon: CalendarBlankIcon },
];

const processSteps = [
  { title: "Выберите категории", text: "Подключите кофе, чай, сиропы или комплекс из трёх направлений.", icon: FolderOpenIcon },
  { title: "Зафиксируйте условия", text: "Оплатите подписку с 1 по 5 число и получите доступ к специальным ценам.", icon: FileTextIcon },
  { title: "Получайте поставки", text: "Передавайте заявку по графику и закупайте только необходимый объём.", icon: CalendarCheckIcon },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand${light ? " brand-light" : ""}`}>
      <span className="brand-mark" aria-hidden="true"><i /></span>
      <span>COFFEE NOSTRA</span>
    </span>
  );
}

function ProcessAccordion() {
  return (
    <div className="process-accordion">
      {processSteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <details key={step.title} open={index === 0}>
            <summary>
              <span className="process-number">0{index + 1}</span>
              <Icon size={28} weight="regular" aria-hidden="true" />
              <strong>{step.title}</strong>
              <span className="process-plus" aria-hidden="true" />
            </summary>
            <p>{step.text}</p>
          </details>
        );
      })}
    </div>
  );
}

function EconomyGraph() {
  return (
    <section className="economy-band" aria-labelledby="economy-title">
      <div className="economy-copy">
        <h2 id="economy-title">Цена ниже — без роста запаса</h2>
        <p>Обычный прайс снижается только вместе с объёмом. Подписочная цена доступна с необходимого вам заказа.</p>
      </div>
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
    </section>
  );
}

function PriceStory() {
  return (
    <section className="price-story" id="prices">
      <div className="price-pin">
        <h2>
          Не нужно покупать <span className="inline-type-image motion-image" aria-hidden="true" /> 150 бутылок ради оптовой цены
        </h2>
        <p>Закупайте только необходимый объём на неделю или месяц по цене крупного опта.</p>
        <a className="text-link" href="#request">Прислать закупочный лист <ArrowRightIcon size={20} /></a>
      </div>
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
    </section>
  );
}

function BarAccordion() {
  const categories = [
    { name: "Сиропы Herbarista", text: "От 522 ₽ по подписке", icon: DropIcon, position: "top" },
    { name: "Чай", text: "Поставка по согласованному графику", icon: TeaBagIcon, position: "center" },
    { name: "Кордиалы", text: "Основа для авторских напитков", icon: FlaskIcon, position: "bottom" },
  ];

  return (
    <div className="bar-accordion">
      {categories.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.name} tabIndex={0}>
            <div className={`bar-photo bar-photo-${item.position} motion-image`} aria-hidden="true" />
            <div className="bar-overlay" />
            <div className="bar-card-copy">
              <Icon size={34} weight="regular" aria-hidden="true" />
              <div><h3>{item.name}</h3><p>{item.text}</p></div>
              <ArrowRightIcon className="bar-arrow" size={24} aria-hidden="true" />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-line", { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" });
      gsap.from(".hero-stage > *", { y: 48, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.35, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".motion-image").forEach((image) => {
        gsap.fromTo(image, { scale: 0.88, opacity: 0.55 }, {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top 92%", end: "bottom 35%", scrub: true },
        });
      });
      gsap.to(".reveal-word", {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: ".reveal-copy", start: "top 85%", end: "bottom 45%", scrub: true },
      });
      gsap.fromTo(".economy-subscription", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".economy-chart", start: "top 80%", end: "bottom 60%", scrub: true },
      });
    });

    media.add("(min-width: 980px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: ".price-story",
        start: "top top+=92",
        end: "bottom bottom-=80",
        pin: ".price-pin",
        pinSpacing: false,
      });
    });

    return () => media.revert();
  }, { scope: rootRef });

  const revealText = "Начните с 1–2 заказов без подписки, оцените продукт и сервис, затем подключите тариф с 1 по 5 число следующего месяца.";

  return (
    <main id="top" ref={rootRef}>
      <header className="site-header">
        <a href="#top" aria-label="Coffee Nostra — начало страницы"><Brand /></a>
        <nav aria-label="Разделы страницы">
          <a href="#process">Как работает</a>
          <a href="#plans">Тарифы</a>
          <a href="#prices">Прайс</a>
          <a href="#delivery">Поставки</a>
        </nav>
        <a className="header-cta" href="#request">Прислать закупочный лист</a>
      </header>

      <section className="hero">
        <h1 className="max-w-editorial" aria-label="Закупайте напитки по ценам крупного опта, а не большими коробками.">
          <span className="hero-line">Закупайте напитки</span>
          <span className="hero-line">по ценам крупного опта,</span>
          <span className="hero-line">а не большими коробками.</span>
        </h1>
        <div className="hero-stage">
          <div className="hero-copy">
            <p>Обычно лучшая цена требует большого объёма. Мы отвязали цену от объёма склада, заморозки денег и дефицита товаров.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#request">Прислать закупочный лист</a>
              <a className="button button-ghost" href="#prices">Посмотреть сравнение цен <ArrowRightIcon size={18} /></a>
            </div>
          </div>
          <figure className="hero-media motion-image">
            <img src="/images/horeca-still-life.png" alt="Профессиональные сиропы, чай и барный инвентарь на стойке" />
            <figcaption>Кофе · чай · сиропы · Казань</figcaption>
          </figure>
        </div>
      </section>

      <div className="category-marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>КОФЕ — ЧАЙ — СИРОПЫ — КОРДИАЛЫ — </span>
          <span>КОФЕ — ЧАЙ — СИРОПЫ — КОРДИАЛЫ — </span>
        </div>
      </div>

      <EconomyGraph />

      <section className="chapter process" id="process">
        <div className="chapter-head">
          <h2>Прозрачные этапы регулярных поставок</h2>
          <p>Цена подписки фиксируется на месяц. Товар оплачивается отдельно — только по фактическому заказу.</p>
        </div>
        <ProcessAccordion />
      </section>

      <section className="chapter plans" id="plans">
        <div className="chapter-head">
          <h2>Условия под структуру закупки</h2>
          <p>Лимит — максимальная сумма закупок по спеццене в месяц, а не обязательный объём заказа.</p>
        </div>
        <div className="plan-bento">
          {plans.map((plan) => (
            <article className={`plan-card${plan.featured ? " plan-featured" : ""}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <div className="plan-price">{plan.price}<small>/ мес</small></div>
              <strong className="plan-limit">{plan.limit}</strong>
              <span className="plan-payment">+ оплата товара по факту заказа</span>
              <span className="plan-saving">экономия — после расчёта по вашему прайсу</span>
              <p>{plan.text}</p>
              <a href="#request">Рассчитать тариф <ArrowRightIcon size={19} /></a>
            </article>
          ))}
        </div>
      </section>

      <PriceStory />

      <section className="trial chapter">
        <p className="reveal-copy">
          {revealText.split(" ").map((word, index) => <span className="reveal-word" key={`${word}-${index}`}>{word} </span>)}
        </p>
        <div className="trial-terms">
          <article><h3>Тестовый вход</h3><strong>1–2 заказа без подписки</strong><p>Вы оплачиваете товар и доставку по обычным условиям и оцениваете продукт в работе.</p></article>
          <article><h3>Подключение</h3><strong>Оплата с 1 по 5 число</strong><p>Если вас всё устроило, подключаем тариф со следующего месяца.</p></article>
        </div>
      </section>

      <section className="chapter delivery" id="delivery">
        <div className="chapter-head">
          <h2>Гарантированный ритм поставок</h2>
          <p>Планируем заказы заранее, чтобы поддерживать наличие без избыточного склада.</p>
        </div>
        <div className="delivery-line">
          {delivery.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.category}>
                <Icon size={42} weight="regular" aria-hidden="true" />
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="chapter hookah">
        <div className="hookah-intro">
          <h2>Оптимизация барного меню кальянных баров</h2>
          <div><p>Соберите меню с высокой маржинальностью на основе сиропов, чая и кордиалов. Закупайте профессиональные ингредиенты без избыточного объёма.</p><a className="button button-ghost" href="#request">Рассчитать тариф <ArrowRightIcon size={18} /></a></div>
        </div>
        <BarAccordion />
      </section>

      <section className="request" id="request">
        <div className="request-copy">
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
        <div><Brand light /><p>B2B-подписка на кофе, чай и сиропы для заведений Казани.</p></div>
        <div className="footer-links"><a href="#process">Как работает</a><a href="#plans">Тарифы</a><a href="#prices">Прайс Herbarista</a><a href="#delivery">Поставки</a></div>
        <a className="footer-top" href="#top">Наверх <ArrowRightIcon size={17} /></a>
      </footer>
    </main>
  );
}
