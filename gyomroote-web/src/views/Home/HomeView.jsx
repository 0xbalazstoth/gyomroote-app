﻿import React, { useContext } from "react";
import "./HomeView.scss";
import LanguageContext from "../../contexts/LanguageContext";
import Container from "react-bootstrap/esm/Container";

const HomeView = () => {
	const { t, i18n } = useContext(LanguageContext);

	return (
		<div>
			<h1>{t("sentence.welcome")}</h1>
		</div>
	);
};

export default HomeView;
