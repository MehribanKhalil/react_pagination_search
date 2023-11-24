import { useMemo, useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageData] = useState(3);
  const [inpValue, setInpValue] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    fetch("https://northwind.vercel.app/api/categories")
      .then((res) => res.json())
      .then((items) => setData(items));
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setInpValue(e.target.value);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortData = useMemo(() => {
    let sortTableDatas = [...data];
    switch (sortConfig.direction) {
      case "asc":
        sortTableDatas.sort((a, b) =>
          a[sortConfig.key] > b[sortConfig.key] ? 1 : b[sortConfig.key] > a[sortConfig.key] ? -1 : 0
        );
        break;
      case "desc":
        sortTableDatas.sort((a, b) =>
        a[sortConfig.key] < b[sortConfig.key] ? 1 : b[sortConfig.key] < a[sortConfig.key] ? -1 : 0
      );
        break;
      default:
        break;
    }
    // if (sortConfig.key) {
    //   sortTableDatas.sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //       return sortConfig.direction === "asc" ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //       return sortConfig.direction === "desc" ? 1 : -1;
    //     }
    //     return 0;
    //   });
    // }
    return sortTableDatas;
  }, [data, sortConfig]);

  const filterredData = sortData.filter(
    (item) =>
      item.name.toLowerCase().includes(inpValue.toLowerCase()) ||
      item.description.toLowerCase().includes(inpValue.toLowerCase())
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filterredData.length / perPageData); i++) {
    pageNumbers.push(i);
  }

  const lastElementIndex = perPageData * currentPage;
  const firstElementIndex = lastElementIndex - perPageData;

  const pageData = filterredData.slice(firstElementIndex, lastElementIndex);

  return (
    <>
      <div>
        <input type="text" onChange={handleChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort("id")}>ID</th>
            <th onClick={() => requestSort("description")}>description</th>
            <th onClick={() => requestSort("name")}>name</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.description}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
      </div>
    </>
  );
}

export default App;
