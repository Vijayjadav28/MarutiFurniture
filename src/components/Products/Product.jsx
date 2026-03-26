import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../libs/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FiSearch, FiSliders, FiGrid } from "react-icons/fi";
import {
  PRODUCT_CATEGORIES,
  parseProductPrice,
  resolveProductCategory,
} from "../../utils/productUtils";
import "./Product.css";

const PRICE_RANGES = [
  { value: "all", label: "Any price" },
  { value: "0-15000", label: "Under ₹15,000" },
  { value: "15000-30000", label: "₹15,000 – ₹30,000" },
  { value: "30000-60000", label: "₹30,000 – ₹60,000" },
  { value: "60000+", label: "Above ₹60,000" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "name-asc", label: "Name: A–Z" },
];

function priceInRange(priceNum, range) {
  if (range === "all") return true;
  if (range === "60000+") return priceNum >= 60000;
  const [a, b] = range.split("-").map(Number);
  return priceNum >= a && priceNum < b;
}

function createdAtSeconds(p) {
  const c = p?.createdAt;
  if (c && typeof c.seconds === "number") return c.seconds;
  if (c && typeof c._seconds === "number") return c._seconds;
  if (c instanceof Date) return Math.floor(c.getTime() / 1000);
  return 0;
}

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = {};
    PRODUCT_CATEGORIES.forEach((c) => {
      counts[c] = 0;
    });
    products.forEach((p) => {
      const cat = resolveProductCategory(p);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.map((p) => ({
      ...p,
      _price: parseProductPrice(p.price),
      _category: resolveProductCategory(p),
    }));

    if (q) {
      list = list.filter((p) => {
        const hay = [
          p.name,
          p.color,
          p.prodid,
          p._category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    if (category !== "all") {
      list = list.filter((p) => p._category === category);
    }

    if (priceRange !== "all") {
      list = list.filter((p) => priceInRange(p._price, priceRange));
    }

    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a._price - b._price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b._price - a._price);
        break;
      case "name-asc":
        sorted.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""), undefined, {
            sensitivity: "base",
          })
        );
        break;
      case "newest":
      default:
        sorted.sort((a, b) => createdAtSeconds(b) - createdAtSeconds(a));
        break;
    }

    return sorted;
  }, [products, searchQuery, category, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setPriceRange("all");
    setSortBy("newest");
  };

  const openProduct = (product) => {
    navigate(`/products/${encodeURIComponent(product.name)}`, {
      state: {
        name: product.name,
        img: product.images,
        color: product.color,
        catid: product.prodid,
        price: parseProductPrice(product.price),
      },
    });
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-shell">
          <div className="products-hero products-hero--compact">
            <div className="products-hero__inner">
              <h1>Our Products</h1>
              <p>Loading catalogue…</p>
            </div>
          </div>
          <div className="products-skeleton-grid" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="products-skeleton-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <header className="products-hero">
        <div className="products-hero__inner">
          <p className="products-hero__eyebrow">Catalogue</p>
          <h1>
            Our <span>Products</span>
          </h1>
          <p className="products-hero__sub">
            Search by name, filter by category and budget, and sort to find the
            right piece for your home.
          </p>
        </div>
      </header>

      <div className="products-shell">
        <div className="products-toolbar">
          <div className="products-toolbar__search">
            <FiSearch className="products-toolbar__search-icon" aria-hidden />
            <label htmlFor="product-search" className="visually-hidden">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              placeholder="Search by name, color, or ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="products-toolbar__filters">
            <div className="products-filter">
              <label htmlFor="filter-category">
                <FiGrid aria-hidden /> Category
              </label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All categories ({products.length})</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c} ({categoryCounts[c] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="products-filter">
              <label htmlFor="filter-price">
                <FiSliders aria-hidden /> Price
              </label>
              <select
                id="filter-price"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="products-filter">
              <label htmlFor="filter-sort">Sort</label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="products-results-meta" aria-live="polite">
          Showing{" "}
          <strong>{filteredSorted.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </p>

        {filteredSorted.length === 0 ? (
          <div className="products-empty">
            <h2>No matches</h2>
            <p>Try a different search term or widen your filters.</p>
            <button type="button" className="products-empty__btn" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredSorted.map((product) => (
              <article
                className="product-card"
                key={product.id}
                onClick={() => openProduct(product)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProduct(product);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${product.name}`}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.images?.[0]}
                    alt={product.name || "Product"}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x400/f4f4f5/71717a?text=No+image";
                    }}
                  />
                  <span className="product-card__category">
                    {product._category}
                  </span>
                  {product.color ? (
                    <span className="color-badge">{product.color}</span>
                  ) : null}
                </div>

                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="price">₹{parseProductPrice(product.price).toLocaleString("en-IN")}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
