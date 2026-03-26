import "./About.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillAlt, FaSyncAlt, FaTruck, FaLeaf } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";

const SHOWROOM_IMG =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80";

const features = [
  {
    icon: FaTruck,
    title: "Home delivery",
    text: "We deliver to your door so you can focus on choosing pieces you love, not moving heavy loads.",
  },
  {
    icon: FaMoneyBillAlt,
    title: "Fair pricing",
    text: "Quality furniture at prices that make sense—clear value without cutting corners on materials.",
  },
  {
    icon: FaSyncAlt,
    title: "Quick response",
    text: "Questions about an order or a product? Our team aims to get back to you as soon as possible.",
  },
  {
    icon: BsBriefcaseFill,
    title: "Trusted service",
    text: "We build long-term relationships through honest advice, reliable delivery, and after-sale support.",
  },
];

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="about-page">
      <header className="about-hero">
        <div className="about-hero__inner">
          <p className="about-hero__eyebrow">Our story</p>
          <h1>
            About <span className="about-hero__brand">Maruti Furniture</span>
          </h1>
          <p className="about-hero__tagline">
            Crafting comfort, delivering style—furniture that feels like home.
          </p>
        </div>
      </header>

      <div className="about-wrap">
        <section className="about-story" aria-labelledby="about-story-heading">
          <div className="about-story__text">
            <h2 id="about-story-heading">Who we are</h2>
            <p>
              Maruti Furniture is built around a simple idea: your space should
              reflect how you live. We curate sofas, beds, tables, and storage
              that balance durability with design—pieces you will use every day,
              not just show off once.
            </p>
            <p>
              Whether you are furnishing a first apartment or refreshing a
              family home, we are here to help you choose confidently and receive
              your order smoothly from browse to delivery.
            </p>
            <div className="about-story__pill">
              <FaLeaf className="about-story__pill-icon" aria-hidden />
              <span>Quality materials, thoughtful design, honest service</span>
            </div>
          </div>
          <figure className="about-story__figure">
            <img
              src={SHOWROOM_IMG}
              alt="Bright, modern furniture showroom with sofas and natural light"
              width={600}
              height={400}
              loading="lazy"
            />
          </figure>
        </section>

        <section className="about-values" aria-labelledby="about-values-heading">
          <div className="about-values__head">
            <h2 id="about-values-heading">
              Why <span className="about-values__accent">Maruti Furniture</span>
            </h2>
            <p>
              Everything we do is aimed at making shopping for furniture
              straightforward, affordable, and stress-free.
            </p>
          </div>
          <ul className="about-values__grid">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="about-value-card">
                <div className="about-value-card__icon-wrap" aria-hidden>
                  <Icon className="about-value-card__icon" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-cta" aria-label="Next steps">
          <p>Ready to find something for your space?</p>
          <div className="about-cta__actions">
            <Link to="/products" className="about-cta__btn about-cta__btn--primary">
              Browse products
            </Link>
            <Link to="/contact" className="about-cta__btn about-cta__btn--ghost">
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
