import { useMemo, useState } from "react";
import { useEffect } from "react";


const usePagination = () => {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageData] = useState(3);

  function getData(key){
    fetch(key)
    .then((res) => res.json())
    .then((items) => setData(items));
  }

  useEffect(() => {
  getData(key)
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / perPageData); i++) {
    pageNumbers.push(i);
  }

  const lastElementIndex = perPageData * currentPage;
  const firstElementIndex = lastElementIndex - perPageData;

  const pageData = useMemo(
    () => data.slice(firstElementIndex, lastElementIndex),
    [data, currentPage]
  );

  return (
   [pageData,pageNumbers,setCurrentPage,key]
  )
}

export default usePagination
