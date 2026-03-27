import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiLayers,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiCpu,
  FiPackage,
  FiGrid,
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
  LABOR_ONLY_RATE,
} from "../../utils/estimatorUtils";

function Estimator() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      {/* Hero Section */}
      <section className="estimator-hero">
        <div className="estimator-shell">
          <div className="estimator-copy">
            <div className="estimator-eyebrow-wrapper">
              <span className="estimator-eyebrow">
                <FiCpu /> Smart Furniture Planner
              </span>
            </div>
            <h1>
              Transform your house dimensions into a <span>smart budget</span>{" "}
              and timeline
            </h1>
            <p>
              Enter your room dimensions and get an instant, realistic furniture
              budget range, project timeline, and detailed cost breakdown based
              on your material and finish preferences.
            </p>

            <div className="estimator-badges">
              <span>
                <FiPackage /> {estimate.selectedHome.rooms}
              </span>
              <span>
                <FiGrid /> {estimate.selectedMaterial.label}
              </span>
              <span>
                <FiClock /> {estimate.selectedUrgency.label}
              </span>
            </div>

            <div className="estimator-summary-grid">
              {summaryCards.map((card, idx) => (
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
            <div className="intro-label-wrapper">
              <span className="intro-label">
                <FiDollarSign /> Quick estimate
              </span>
            </div>
            <h2>
              {estimate.hasValidArea
                ? `${formatCurrency(estimate.estimatedLow)} — ${formatCurrency(
                    estimate.estimatedHigh
                  )}`
                : "Enter dimensions to begin"}
            </h2>
            <div className="intro-metrics">
              <div>
                <FiCalendar />
                <p>Timeline</p>
                <strong>{estimate.weekRange}</strong>
              </div>
              <div>
                <FiClock />
                <p>Start window</p>
                <strong>{estimate.startWindow}</strong>
              </div>
              <div>
                <FiUsers />
                <p>Site team</p>
                <strong>
                  {estimate.teamSize ? `${estimate.teamSize} specialists` : "--"}
                </strong>
              </div>
              <div>
                <FiLayers />
                <p>Craft level</p>
                <strong>{estimate.selectedPackage.label}</strong>
              </div>
            </div>
            <button
              type="button"
              className="estimator-primary-button"
              onClick={() => navigate("/contact")}
            >
              Book a free consultation <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Workbench Section */}
      <section className="estimator-workbench">
        <div className="estimator-panel estimator-form-panel">
          <div className="panel-heading">
            <span>
              <FiGrid /> Configure your project
            </span>
            <h2>Build your custom estimate</h2>
            <p>
              Adjust dimensions, materials, and scope to see how your choices
              affect budget and timeline.
            </p>
          </div>

          <form className="estimator-form">
            <div className="dimension-group">
              <h4>
                <FiHome /> House dimensions
              </h4>
              <div className="field-grid field-grid-two">
                <label className="form-field">
                  <span>Length (feet)</span>
                  <input
                    type="number"
                    min="1"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="e.g., 40"
                  />
                </label>
                <label className="form-field">
                  <span>Width (feet)</span>
                  <input
                    type="number"
                    min="1"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                  />
                </label>
              </div>
            </div>

            <div className="options-group">
              <h4>
                <FiPackage /> Project options
              </h4>
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
            </div>

            <div className="checkbox-fieldset">
              <div className="checkbox-header">
                <h4>
                  <FiLayers /> Add-on spaces
                </h4>
                <p>Select the additional rooms you want to include</p>
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
                      <small>Adds timeline and budget based on scope</small>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkbox-fieldset labor-only-section">
              <div className="checkbox-header">
                <h4>
                  <FiDollarSign /> Labor Only Option
                </h4>
                <p>Get only labor charges without material (₹{LABOR_ONLY_RATE}/sqft)</p>
              </div>
              <label className="checkbox-card labor-card">
                <input
                  type="checkbox"
                  name="laborOnly"
                  checked={Boolean(formData.laborOnly)}
                  onChange={handleChange}
                />
                <span className="checkbox-mark" />
                <div>
                  <strong>Labor Only (₹{LABOR_ONLY_RATE}/sqft)</strong>
                  <small>Only carpentry and installation labor, no material cost</small>
                </div>
              </label>
            </div>

            {/* Show furniture items included for selected home type */}
            <div className="furniture-items-section">
              <h4><FiPackage /> Furniture Included in {estimate.selectedHome.label}</h4>
              <ul className="furniture-items-list">
                {estimate.selectedHome.furnitureItems?.map((item, idx) => (
                  <li key={idx}><FiCheckCircle /> {item}</li>
                ))}
              </ul>
            </div>
          </form>
        </div>

        <div className="estimator-panel estimator-results-panel">
          <div className="panel-heading">
            <span>
              <FiTrendingUp /> Your estimate
            </span>
            <h2>
              {estimate.hasValidArea
                ? `${formatCurrency(estimate.estimatedLow)} — ${formatCurrency(
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
              <FiHome />
              <div>
                <p>Total planning area</p>
                <strong>
                  {estimate.hasValidArea
                    ? `${estimate.area.toLocaleString("en-IN")} sq ft`
                    : "--"}
                </strong>
                <span>{estimate.selectedHome.rooms}</span>
              </div>
            </article>
            <article className="result-stat-card">
              <FiCalendar />
              <div>
                <p>Expected project time</p>
                <strong>{estimate.weekRange}</strong>
                <span>{estimate.installRange}</span>
              </div>
            </article>
            <article className="result-stat-card">
              <FiUsers />
              <div>
                <p>Workshop + install team</p>
                <strong>
                  {estimate.teamSize ? `${estimate.teamSize} people` : "--"}
                </strong>
                <span>Carpentry, polish, fitting, supervision</span>
              </div>
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
              <span>Total estimated investment</span>
              <strong>{formatCurrency(estimate.totalEstimate)}</strong>
            </div>
          </div>

          <div className="project-tags">
            {estimate.selectedAddons.map((addon) => (
              <span key={addon.key}>{addon.label}</span>
            ))}
            {!estimate.selectedAddons.length ? (
              <span className="empty-tag">Select add-ons to expand scope</span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Detail Grid */}
      <section className="estimator-detail-grid">
        <article className="detail-card">
          <div className="panel-heading">
            <span>
              <FiDollarSign /> Budget breakdown
            </span>
            <h2>Where your investment goes</h2>
            <p>A transparent view of how costs are distributed across your project.</p>
          </div>

          <div className="breakdown-list">
            {estimate.budgetBreakdown.map((item) => (
              <div key={item.label} className="breakdown-item">
                <div className="breakdown-header">
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.share.toFixed(0)}% of total</span>
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
            <span>
              <FiClock /> Milestone plan
            </span>
            <h2>Project journey timeline</h2>
            <p>Typical flow for a full-home furniture project.</p>
          </div>

          <div className="milestone-list">
            {estimate.milestonePlan.map((milestone, idx) => (
              <div key={milestone.label} className="milestone-card">
                <div className="milestone-step">{idx + 1}</div>
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

      {/* Notes Section */}
      <section className="estimator-notes">
        <article className="note-card">
          <div className="panel-heading">
            <span>
              <FiCheckCircle /> What's included
            </span>
            <h2>Planning benefits</h2>
          </div>
          <ul className="note-list">
            <li>
              <FiCheckCircle /> Budget planning before final design approval
            </li>
            <li>
              <FiCheckCircle /> Compare practical vs premium finishing choices
            </li>
            <li>
              <FiCheckCircle /> Understand how project scope affects timeline
            </li>
            <li>
              <FiCheckCircle /> Prepare for workshop, delivery, and installation
            </li>
          </ul>
        </article>

        <article className="note-card note-card-accent">
          <div className="panel-heading">
            <span>
              <FiTrendingUp /> Next steps
            </span>
            <h2>Ready to bring your vision to life?</h2>
            <p>
              This estimate gives you a confident starting point. Our team will
              refine it with site measurements, material samples, and your
              personal preferences.
            </p>
          </div>

          <div className="note-actions">
            <button
              type="button"
              className="estimator-primary-button"
              onClick={() => navigate("/contact")}
            >
              Schedule consultation <FiArrowRight />
            </button>
            <button
              type="button"
              className="estimator-secondary-button"
              onClick={() => navigate("/products")}
            >
              Browse collections <FiLayers />
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Estimator;