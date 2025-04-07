import React from "react";
import "../../index.css";
import { Cats } from "../Constant/Common";

const Pagination = ({ totalPages, currentPage, setCurrentPage, onAddCategory }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    let startPage, endPage;

    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handleClick(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pages.unshift(
        <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => handleClick(1)}>
            1
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pages.push(
        <li key={totalPages} className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
          <button className="page-link" onClick={() => handleClick(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <button className="btn btn-primary" onClick={onAddCategory}>
        {Cats.CateAdd}
      </button>
      <ul className="pagination pagination-separated mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className={`page-link ${currentPage === 1 ? "disabled-link" : ""}`}
            onClick={() => currentPage !== 1 && handleClick(currentPage - 1)}
          >
            {Cats.CatePrevious}
          </button>
        </li>

        {renderPageNumbers()}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className={`page-link ${currentPage === totalPages ? "disabled-link" : ""}`}
            onClick={() => currentPage !== totalPages && handleClick(currentPage + 1)}
          >
            {Cats.CateNext}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
