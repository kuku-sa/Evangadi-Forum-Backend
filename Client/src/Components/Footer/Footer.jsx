import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
// import logo2 from "../../assets/logo2.png"; 
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
           
            <img src="/logo2.png" alt="Evangadi Logo" />
          </div>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Evangadi on Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Evangadi on Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@EvangadiTech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Evangadi on YouTube"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.tiktok.com/@evangaditech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Evangadi on TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <Link to="/how-it-works">How it works</Link>{" "}
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>Evangadi Networks</li>
            <li>support@evangadi.com</li>
            <li>+1-202-386-2702</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import React from "react";
// import { Link } from "react-router-dom";
// import "./Footer.css";
// import logo2 from "../../assets/logo2.png";
// import { FaFacebookF, FaInstagram,FaTiktok, FaYoutube } from "react-icons/fa";
//  import { FaXTwitter } from "react-icons/fa6";

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         <div className="footer-section">
//           <div className="footer-logo">
//             <img src={logo2} alt="Evangadi Logo" />
//           </div>
//           <div className="footer-social">

//             <a
//                href="https://www.facebook.com/evangaditech"
//             target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Visit Evangadi on Facebook"
//             >
//               <FaFacebookF />
//             </a>
//              <a
//               href="https://www.instagram.com/evangaditech"
//                target="_blank"
//               rel="noopener noreferrer"
//              aria-label="Visit Evangadi on Instagram"
//             >
//              <FaInstagram />
//             </a>
//             <a
//               href="https://www.youtube.com/@EvangadiTech"
//               target="_blank"
//               rel="noopener noreferrer"
//                aria-label="Visit Evangadi on YouTube"
//            >
//               <FaYoutube />
//             </a>
//             <a
//               href="https://www.tiktok.com/@evangaditech"
//              target="_blank"
//                rel="noopener noreferrer"
//               aria-label="Visit Evangadi on Twitter"
//            >
//              <FaTiktok />
//             </a>

//           </div>
//         </div>

//         <div className="footer-section">
//           <h3>Useful Links</h3>
//           <ul>
//             <li>
//               <Link to="/how-it-works">How it works</Link>
//             </li>
//             <li>
//               <a href="#">Terms of Service</a>
//             </li>
//             <li>
//               <a href="#">Privacy Policy</a>
//             </li>
//           </ul>
//         </div>

//         <div className="footer-section">
//           <h3>Contact Info</h3>
//           <ul>
//             <li>Evangadi Networks</li>
//             <li>support@evangadi.com</li>
//             <li>+1-202-386-2702</li>
//           </ul>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
