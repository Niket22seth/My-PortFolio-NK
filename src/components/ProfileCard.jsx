// src/components/ProfileCard.jsx
import "./ProfileCard.css";

export default function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-card__lanyard" aria-hidden="true" />
      <div className="profile-card__badge">
        <div className="profile-card__photo-wrap">
          {/* Drop a real photo at public/profile.jpg and this renders automatically */}
          <img
            src="/profile.jpg"
            alt="Niket Kumar Gupta"
            className="profile-card__photo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          <div className="profile-card__photo-fallback">NKG</div>
        </div>

        <p className="profile-card__name">Niket Kumar Gupta</p>
        <p className="profile-card__role">Software Developer Intern</p>

        <div className="profile-card__footer">
          <span className="profile-card__status-dot" aria-hidden="true" />
          Available for opportunities
        </div>
      </div>
    </div>
  );
}
