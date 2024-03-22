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
	const [last, setLast] = useState();  // Nouvel état pour stocker la dernière prestation
	const getData = useCallback(async () => {
		try {
			const DataEvent = await api.loadData(); /* Chargement des données */
			setData(DataEvent);
			const events = DataEvent?.events.sort((evtA, evtB) => // Tri des événement
				new Date(evtA.date) < new Date(evtB.date) ? -1 : 1 // Classer du plus au moins récent
			);
			setLast(events[0]); /* Assignation du premier événement a setLast le plus récent du tableau dataCopy */
		} catch (err) {
			setError(err);
		}
	}, []);
	useEffect(() => {
		if (data)// Si data, on appelle getData()
			return;
		getData();
	});

	return (
		<DataContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				data,
				error,
				last,// Ajout de last dans le context pour le récupérer dans la page Home
			}}>
			{children}
		</DataContext.Provider>
	);
};

DataProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
