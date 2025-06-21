// About.js component
import "./About.css";
import { db } from "../../libs/firebase";
import { collection, addDoc } from "firebase/firestore";

function About() {
  return (
    <div className="about-page"> {/* New wrapper */}
      <div className="about-container">
        <div className="about-header">
          <h1>About Maruti Furniture</h1>
          <p>Crafting Comfort, Delivering Style</p>
        </div>

        <div className="about-content">
          <p>
            At Maruti Furniture, we are passionate about creating furniture that blends quality, 
            comfort, and design. Since our beginning, we've been dedicated to providing our 
            customers with stylish, long-lasting furniture that fits every space and lifestyle.
          </p>
          
          <p>
            From  sofas to elegant dining sets, our wide range of products is designed with 
            both function and aesthetics in mind. We believe that your home deserves the best – 
            and we strive to deliver just that.
          </p>
          
          <p>
            Visit us today to explore our beautiful furniture collections and experience the 
            Maruti difference!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;