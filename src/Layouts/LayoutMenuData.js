import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/scss/themes.scss";
import { Ten } from "../Components/Constants/Common";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isProducts, setIsProducts] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== Ten.Dashboard) {
      setIsDashboard(false);
    }
    if (iscurrentState !== Ten.Apps) {
      setIsApps(false);
    }
    if (iscurrentState !== Ten.Category) {
      setIsCategory(false);
    }
    if (iscurrentState !== Ten.Reports) {
      setIsReports(false);
    }
    if (iscurrentState !== Ten.Prodcuts) {
      setIsProducts(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isCategory,
    isReports,
    isProducts,
  ]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "category",
      label: "Category",
      icon: "ri-folder-line",
      link: "/category",
      stateVariables: isCategory,
      click: function (e) {
        e.preventDefault();
        setIsCategory(!isCategory);
        setIscurrentState("Category");
        updateIconSidebar(e);
      },
    },
 
    {
      id: "products",
      label: "Products",
      icon: "ri-shopping-bag-line",
      link: "/products",
      stateVariables: isProducts,
      click: function (e) {
        e.preventDefault();
        setIsProducts(!isProducts);
        setIscurrentState("Products");
        updateIconSidebar(e);
      },
    },
    {
      id: "reports",
      label: "Reports",
      icon: "ri-file-chart-line",
      link: "/reports",
      stateVariables: isReports,
      click: function (e) {
        e.preventDefault();
        setIsReports(!isReports);
        setIscurrentState("Reports");
        updateIconSidebar(e);
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
