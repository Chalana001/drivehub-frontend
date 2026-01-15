import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} DriveHub. All rights reserved.</p>
        <p className="gold">Luxury rentals simplified.</p>
      </div>
    </footer>
  );
}
