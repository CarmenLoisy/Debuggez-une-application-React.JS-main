import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Fonction pour trier les événements par date dans l'ordre décroissant
  const getSortedData = () => {
    if (!data || !data.focus) {
      return [];
    }
    return data.focus.sort((evtA, evtB) =>
      new Date(evtA.date) < new Date(evtB.date) ? 1 : -1
    );
  };
  const byDateDesc = getSortedData();

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    setIndex((index + 1) % byDateDesc.length);
  };

  useEffect(() => {
    const timer = setInterval(nextCard, 5000);
    return () => clearInterval(timer);// Nettoyage du timer
}, [index, byDateDesc.length]); // Déclencher l'effet à chaque changement d'index ou de la longueur des données

  const handleInputClick = (radioIdx) => {
    setIndex(radioIdx);
  };

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div key={event.title} className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event, radioIdx) => (
            <input
              key={event.title}// Utilisation du titre de l'événement comme clé
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleInputClick(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
