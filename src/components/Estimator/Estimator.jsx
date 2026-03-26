import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";
import "./Estimator.css";
import {
  addonOptions,
  calculateEstimate,
  defaultEstimateForm,
  formatCurrency,
  homeOptions,
  materialOptions,
  packageOptions,
  urgencyOptions,
} from "../../utils/estimatorUtils";

function Estimator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultEstimateForm);

  const estimate = calculateEstimate(formData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const summaryCards = [
    {
      icon: <FiHome />,
      title: "Planning area",
      value: estimate.hasValidArea
        ? `${estimate.area.toLocaleString("en-IN")} sq ft`
        : "Add dimensions",
      note: estimate.hasValidArea
        ? `${estimate.areaSquareMeters.toFixed(0)} sq m usable footprint`
        : "Length x width unlocks the estimate",
    },
    {
      icon: <FiTrendingUp />,
      title: "Estimated spend",
      value: estimate.hasValidArea
        ? `${formatCurrency(estimate.estimatedLow)} to ${formatCurrency(
            estimate.estimatedHigh
          )}`
        : "Waiting for size",
      note: estimate.selectedPackage.note,
    },
    {
      icon: <FiClock />,
      title: "Completion window",
      value: estimate.weekRange,
      note: estimate.installRange,
    },
  ];

  return (
    <div className="estimator-page">
      <section className="estimator-hero">
        <div className="estimator-shell">
          <div className="estimator-copy">
            <span className="estimator-eyebrow">Furniture project planner</span>
            <h1>
              Give your house length and width, and we will estimate furniture
              cost and completion time.
            </h1>
            <p>
              This planning page turns simple house dimensions into a realistic
              furnishing budget window, expected execution time, and a breakdown
              of where the money typically goes.
            </p>

            <div className="estimator-badges">
              <span>{estimate.selectedHome.rooms}</span>
              <span>{estimate.selectedMaterial.label}</span>
              <span>{estimate.selectedUrgency.label}</span>
            </div>

            <div className="estimator-summary-grid">
              {summaryCards.map((card) => (
                <article key={card.title} className="estimator-summary-card">
                  <div className="summary-card-icon">{card.icon}</div>
                  <div>
                    <p>{card.title}</p>
                    <h3>{card.value}</h3>
                    <span>{card.note}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="estimator-intro-card">
            <span className="intro-label">Quick estimate</span>
            <h2>
              {estimate.hasValidArea
                ? `${formatCurrency(estimate.estimatedLow)} - ${formatCurrency(
                    estimate.estimatedHigh
                  )}`
                : "Enter dimensions to begin"}
            </h2>
            <div className="intro-metrics">
              <div>
                <p>Timeline</p>
                <strong>{estimate.weekRange}</strong>
              </div>
              <div>
                <p>Start window</p>
                <strong>{estimate.startWindow}</strong>
              </div>
              <div>
                <p>Site team</p>
                <strong>
                  {estimate.teamSize ? `${estimate.teamSize} specialists` : "--"}
                </strong>
              </div>
              <div>
                <p>Craft level</p>
                <strong>{estimate.selectedPackage.label}</strong>
              </div>
            </div>
            <button
              type="button"
              className="estimator-primary-button"
              onClick={() => navigate("/contact")}
            >
              Book a consultation <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="estimator-workbench">
        <div className="estimator-panel estimator-form-panel">
          <div className="panel-heading">
            <span>Project details</span>
            <h2>Build your estimate</h2>
            <p>
              Tune the house size, furnishing level, and add-ons to match your
              project scope.
            </p>
          </div>

          <form className="estimator-form">
            <div className="field-grid field-grid-two">
              <label className="form-field">
                <span>House length</span>
                <input
                  type="number"
                  min="1"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="40"
                />
                <small>Enter in feet</small>
              </label>

              <label className="form-field">
                <span>House width</span>
                <input
                  type="number"
                  min="1"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="30"
                />
                <small>Enter in feet</small>
              </label>
            </div>

            <div className="field-grid field-grid-two">
              <label className="form-field">
                <span>Home type</span>
                <select
                  name="homeType"
                  value={formData.homeType}
                  onChange={handleChange}
                >
                  {Object.entries(homeOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label} ({option.rooms})
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Furnishing package</span>
                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                >
                  {Object.entries(packageOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="field-grid field-grid-two">
              <label className="form-field">
                <span>Material finish</span>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                >
                  {Object.entries(materialOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Execution speed</span>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  {Object.entries(urgencyOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="checkbox-fieldset">
              <div className="checkbox-header">
                <span>Project scope</span>
                <p>Turn on the spaces you want included in the quote.</p>
              </div>

              <div className="checkbox-grid">
                {Object.entries(addonOptions).map(([key, option]) => (
                  <label key={key} className="checkbox-card">
                    <input
                      type="checkbox"
                      name={key}
                      checked={Boolean(formData[key])}
                      onChange={handleChange}
                    />
                    <span className="checkbox-mark" />
                    <div>
                      <strong>{option.label}</strong>
                      <small>
                        Adds timeline and budget based on selected scope
                      </small>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="estimator-panel estimator-results-panel">
          <div className="panel-heading">
            <span>Estimate output</span>
            <h2>
              {estimate.hasValidArea
                ? `${formatCurrency(estimate.estimatedLow)} - ${formatCurrency(
                    estimate.estimatedHigh
                  )}`
                : "Waiting for dimensions"}
            </h2>
            <p>
              Based on {estimate.selectedPackage.label.toLowerCase()},
              {` ${estimate.selectedMaterial.label.toLowerCase()}`} and a{" "}
              {estimate.selectedUrgency.label.toLowerCase()} schedule.
            </p>
          </div>

          <div className="results-grid">
            <article className="result-stat-card">
              <p>Total planning area</p>
              <strong>
                {estimate.hasValidArea
                  ? `${estimate.area.toLocaleString("en-IN")} sq ft`
                  : "--"}
              </strong>
              <span>{estimate.selectedHome.rooms}</span>
            </article>
            <article className="result-stat-card">
              <p>Expected project time</p>
              <strong>{estimate.weekRange}</strong>
              <span>{estimate.installRange}</span>
            </article>
            <article className="result-stat-card">
              <p>Workshop + install team</p>
              <strong>
                {estimate.teamSize ? `${estimate.teamSize} people` : "--"}
              </strong>
              <span>Carpentry, polish, fitting, supervision</span>
            </article>
          </div>

          <div className="results-summary">
            <div className="summary-line">
              <span>Core furniture package</span>
              <strong>{formatCurrency(estimate.packageBudget)}</strong>
            </div>
            <div className="summary-line">
              <span>Material premium</span>
              <strong>{formatCurrency(estimate.materialBudget)}</strong>
            </div>
            <div className="summary-line">
              <span>Selected add-ons</span>
              <strong>{formatCurrency(estimate.addonBudget)}</strong>
            </div>
            <div className="summary-line">
              <span>Design, delivery, install</span>
              <strong>{formatCurrency(estimate.designAndInstall)}</strong>
            </div>
            <div className="summary-line total-line">
              <span>Estimated investment</span>
              <strong>{formatCurrency(estimate.totalEstimate)}</strong>
            </div>
          </div>

          <div className="project-tags">
            {estimate.selectedAddons.map((addon) => (
              <span key={addon.key}>{addon.label}</span>
            ))}
            {!estimate.selectedAddons.length ? (
              <span>Choose add-ons to expand the quote</span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="estimator-detail-grid">
        <article className="detail-card">
          <div className="panel-heading">
            <span>Budget split</span>
            <h2>Where the estimate usually goes</h2>
            <p>
              A high-level breakdown to help you understand major spend zones.
            </p>
          </div>

          <div className="breakdown-list">
            {estimate.budgetBreakdown.map((item) => (
              <div key={item.label} className="breakdown-item">
                <div className="breakdown-header">
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.share.toFixed(0)}% of estimated budget</span>
                  </div>
                  <p>{formatCurrency(item.amount)}</p>
                </div>
                <div className="breakdown-bar">
                  <span style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="detail-card">
          <div className="panel-heading">
            <span>Milestone plan</span>
            <h2>How a full-home project typically moves</h2>
            <p>
              Use this as a planning guide before the final site visit and quote.
            </p>
          </div>

          <div className="milestone-list">
            {estimate.milestonePlan.map((milestone) => (
              <div key={milestone.label} className="milestone-card">
                <div className="milestone-step">{milestone.share}</div>
                <div className="milestone-content">
                  <strong>{milestone.label}</strong>
                  <span>{milestone.detail}</span>
                </div>
                <p>{formatCurrency(milestone.amount)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="estimator-notes">
        <article className="note-card">
          <div className="panel-heading">
            <span>Included in planning</span>
            <h2>What this estimate is useful for</h2>
          </div>
          <ul className="note-list">
            <li>
              <FiCheckCircle /> Budget planning before final design approval
            </li>
            <li>
              <FiCheckCircle /> Comparing practical vs premium finishing choices
            </li>
            <li>
              <FiCheckCircle /> Understanding how project scope affects timeline
            </li>
            <li>
              <FiCheckCircle /> Preparing for workshop, delivery, and install
            </li>
          </ul>
        </article>

        <article className="note-card note-card-accent">
          <div className="panel-heading">
            <span>Best next step</span>
            <h2>Turn the estimate into a final design plan</h2>
            <p>
              Final pricing can change after site measurements, finish samples,
              and hardware selections. This page is designed to give you a
              confident planning range.
            </p>
          </div>

          <div className="note-actions">
            <button
              type="button"
              className="estimator-primary-button"
              onClick={() => navigate("/contact")}
            >
              Contact Our Team <FiArrowRight />
            </button>
            <button
              type="button"
              className="estimator-secondary-button"
              onClick={() => navigate("/products")}
            >
              Browse Collections <FiLayers />
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Estimator;
