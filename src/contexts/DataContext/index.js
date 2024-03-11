import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState();
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (!data || !data.events) { // Si data ou data.events n'existe pas, on appelle getData()
    getData();
		return;
	}
	const dataCopy = [...data.events]; // copie de data.events, pour classer du plus au moins récent
    dataCopy.sort((a, b) => (a.date < b.date ? 1 : -1));
    setLast(dataCopy[0]); // set du state last avec l'event le plus récent du tableau dataCopy
  }, [data, getData]); // appel du hook useEffect à chaque modification de data ou getData
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
		last, // Ajout de last dans le context pour le récupérer dans la page Home
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
