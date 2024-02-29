import React, { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
	const { data, error } = useData();
	const [type, setType] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (newPage) => {
		console.log("Changing to page:", newPage);
		setCurrentPage(newPage);
	};

	const handleTypeChange = (newType) => {
		console.log("Changing type to:", newType);
		setCurrentPage(1);
		setType(newType);
	};

	const filteredEvents = (data?.events || [])
		.filter((event) => !type || event.type === type)
		.filter((event, index) => {
			const startIndex = (currentPage - 1) * PER_PAGE;
			const endIndex = currentPage * PER_PAGE;
			console.log("startIndex:", startIndex, "endIndex:", endIndex, "index:", index);
			return startIndex <= index && index < endIndex;
		});

	const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
	const typeList = new Set(data?.events?.map((event) => event.type) || []);

	console.log("currentPage:", currentPage);
	console.log("pageNumber:", pageNumber);
	console.log("Filtered Events:", filteredEvents);

	return (
		<>
			{error && <div>An error occurred</div>}
			{data === null ? (
				"loading"
			) : (
				<>
					<h3 className="SelectTitle">Catégories</h3>
					<Select
						selection={Array.from(typeList)}
						onChange={(newValue) => handleTypeChange(newValue)}
					/>

					<div id="events" className="ListContainer">
						{filteredEvents.length > 0 ? (
							filteredEvents.map((event) => (
								<Modal key={event.id} Content={<ModalEvent event={event} />}>
									{({ setIsOpened }) => (
										<EventCard
											onClick={() => setIsOpened(true)}
											imageSrc={event.cover}
											title={event.title}
											date={new Date(event.date)}
											label={event.type}
										/>
									)}
								</Modal>
							))
						) : (
							<div>No events to display.</div>
						)}
					</div>

					<div className="Pagination">
						{Array.from({ length: pageNumber }, (_, n) => (
							<a key={`page-${n + 1}`} href="#events" onClick={() => handlePageChange(n + 1)}>
								{n + 1}
							</a>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default EventList;
