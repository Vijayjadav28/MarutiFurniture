// About.js component
import "./About.css";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";
import { FaMoneyBillAlt, FaSyncAlt, FaTruck } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { useEffect } from "react";




function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <section className="about-page">
      <div className="about-container">
       
        <div className="about-header">
          <h1>
            About <span>Maruti Furniture</span>
          </h1>
          <p>Crafting Comfort, Delivering Style</p>
        </div>
        <section className="why-maruti">
       <div className="left">
           <h2 className="why-title">
            Why <span>MarutiFurniture</span>
          </h2>
       <div className="feature-row">
            <div className="feature-card">
              <FaTruck className="feature-icon" />
              <div>
                <h4>Home Delivery</h4>
                <p>
                  We are providing you home delivery so you won't have to worry
                  about your things.
                </p>
              </div>
              
            </div>
            
            <div className="feature-card">
              <FaMoneyBillAlt className="feature-icon" />
              <div>
                <h4>Best Price</h4>
                <p>
                  We are providing you cheaper price and offer you good quality.
                </p>
              </div>
            </div>
          </div>
       
          <div className="feature-row">
            <div className="feature-card">
              <FaSyncAlt className="feature-icon" />
              <div>
                <h4>Quick Response</h4>
                <p>
                  You can get Response as soon as possible. Our team is always
                  ready to help you.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <BsBriefcaseFill className="feature-icon" />
              <div>
                <h4>Trusted Service</h4>
                <p>
                  We believe in building long-term relationships with our
                  customers through trust and quality.
                </p>
              </div>
            </div>
          </div>
       </div>
       <div className="right">
        <img src="shop.jpg" alt="" width="500px" height="350px" />
       </div>
        </section>
      </div>
    </section>
  );
}

export default About;
