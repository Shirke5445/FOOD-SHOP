import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  const [currentPage, setCurrentPage] = useState(1);

  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);

    if (searchParams.has("page")) {
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }
    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  if (!filteredProductsCount || filteredProductsCount <= resPerPage) {
    return null; // Don't render pagination if there are no products or if all products fit in one page
  }

  return (
    <div className="d-flex justify-content-center my-5">
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={2}
        totalItemsCount={filteredProductsCount}
        onChange={setCurrentPageNo}
        nextPageText={"Next"}
        prevPageText={"Prev"}
        firstPageText={"First"}
        lastPageText={"Last"}
        itemClass="page-item"
        linkClass="page-link"
      />
    </div>
  );
};

export default CustomPagination;
