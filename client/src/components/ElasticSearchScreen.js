import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  CardBody,
  Card,
  PaginationItem,
  PaginationLink,
  Pagination,
} from "reactstrap";
import _, { filter } from "lodash";
import * as QueryString from "query-string";

import { useHistory } from "react-router-dom";

import Axios from "axios";
import { API_URL } from "../config.json";
import { _Card } from "./Card";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/search.css";
import "../styles/spinner.scss";
import JobTitleSearch from "./JobTitleSearch";

export const Search = (props) => {
  const [showSortby, setShowSortBy] = useState(false);
  const [sortBy, setSortBy] = useState("Relevence");
  const [q, setQ] = useState("");

  const [lowerRange, setLowerRange] = useState(0);
  const [upperRange, setUpperRange] = useState(0);
  const [width, setWidth] = useState();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lowerIndex, setLowerIndex] = useState(0);
  const [countries, setCountries] = useState({});
  const [filterCountries, setFilterCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [job_title, setTitle] = useState("");
  const [jobTitleLevels, setJobTitleLevels] = useState({});

  const [establishedDate, setEstablishedDate] = useState([
    { key: 0, name: "Within the last 50 years", items: [] },
    { key: 1, name: "50 - 100 years ago", items: [] },
    { key: 2, name: "More than 100 years ago", items: [] },
  ]);
  const [selectedEstablishedDates, setSelectedEstablishedDates] = useState([]);

  const limitRef = useRef(10);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!q) return;
    props.history.push(`/?search=${q}`);

    setSkip(0);
    setCurrentPage(1);
    setLowerIndex(0);
    getData(q);
  };
  useEffect(() => {
    const params = QueryString.parse(props.location.search);
    setQ(params.search);
    getData(params.search ? params.search : "");
  }, [limit, skip]);

  useEffect(() => {
    if (sortBy == "Relevence") {
      setData([..._.shuffle(data)]);
    } else {
      setData([
        ..._.sortBy(data, [
          function (o) {
            return o.job_title;
          },
        ]),
      ]);
    }
  }, [sortBy]);

  const getData = (query) => {
    setLoading(true);
    Axios.get(
      `${API_URL}search?q=${query}&skip=${skip}&limit=${limit}&job_title=${job_title}`
    )
      .then(({ data }) => {
        if (data.body.hits.total.value == 0) setSkip(0);
        _setData(data.body.hits.hits);

        setTotal(data.body.hits.total.value);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const _setData = (__data) => {
    setData(
      __data.map((d) => {
        return JSON.parse(d._source.json);
      })
    );

    const _data = {};
    __data
      .map((d) => JSON.parse(d._source.json))
      .map(({ location_country }) => {
        if (!location_country) return;
        _data[location_country] = _data[location_country]
          ? _data[location_country] + 1
          : 1;
      });
    const job_title_Levels = {};

    __data
      .map((d) => JSON.parse(d._source.json))
      .map(({ job_title_levels }) => job_title_levels)
      .map((item) =>
        item.map((i) => {
          if (job_title_Levels[i])
            job_title_Levels[i] = job_title_Levels[i] + 1;
          else job_title_Levels[i] = 1;
        })
      );
    setJobTitleLevels(job_title_Levels);

    console.log(job_title_Levels);
    const currentYear = new Date().getFullYear();

    __data
      .map((d) => JSON.parse(d._source.json))
      .map((item) => {
        const { job_start_date } = item;
        if (job_start_date) {
          let difference = currentYear - job_start_date.split("-")[0];
          if (difference < 50) {
            const obj = establishedDate[0];
            obj.items.push(item);
          } else if (difference >= 50 && difference < 100) {
            const obj = establishedDate[1];
            obj.items.push(item);
          } else {
            const obj = establishedDate[2];
            obj.items.push(item);
          }
        }
      });
    setCountries(_data);
  };

  const paginatePlus = () => {
    if (currentPage == total) return;
    setCurrentPage(currentPage + 1);
    setLowerIndex(lowerIndex + 1);
    setSkip(skip + limitRef.current);
  };
  const paginateMinus = () => {
    if (currentPage == 1) return;
    setCurrentPage(currentPage - 1);
    setLowerIndex(lowerIndex - 1);
    setSkip(skip - limitRef.current);
  };
  const _getData = () => {
    return data
      .filter((item) => {
        if (filterCountries.length > 0)
          return filterCountries.includes(item.location_country);
        return item;
      })
      .filter((item, index) => {
        if (lowerRange == 0) return true;
        if (item.job_company_size) {
          const lowerLimit = item.job_company_size.split("-")[0];
          if (lowerRange !== 0)
            return parseInt(lowerLimit) >= parseInt(lowerRange);
          else return true;
        }
      })
      .filter((item, index) => {
        if (upperRange == 0) return true;
        if (item.job_company_size) {
          const lowerLimit = item.job_company_size.split("-")[1];
          if (upperRange !== 0)
            return parseInt(upperRange) <= parseInt(lowerLimit);
          else return true;
        }
      })
      .filter((item, index) => {
        if (job_title)
          if (item.job_title)
            if (item.job_title.includes(job_title)) return true;
            else return false;

        return true;
      });
  };

  const handleOnFilterChange = (e) => {
    if (filterCountries.includes(e.target.value)) {
      setFilterCountries([
        ...filterCountries.filter((item) => item != e.target.value),
      ]);
    } else {
      if (!e.target.value) return;
      setFilterCountries([...filterCountries, e.target.value]);
    }
  };
  const handleSortBy = (title) => {
    setSortBy(title);
    setShowSortBy(false);
  };
  return (
    <React.Fragment>
      {loading && (
        <div className="wrapper">
          <div className="spin" />
        </div>
      )}

      <div className="container">
        <div className="row main">
          <div className="col-sm-12 main-search">
            <form
              onSubmit={submit}
              style={{ width: "90%", display: "flex", flexDirection: "row" }}
            >
              <Input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button
                color="primary"
                className="search-btn"
                disabled={loading || !q}
              >
                Search
              </Button>
            </form>
          </div>
        </div>
        {total === 0 && !loading && (
          <h2 className="no-data-found">No data found</h2>
        )}
        {!loading && total !== 0 && (
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-3 sidebar">
              <p>Sort by</p>
              <div
                className="sort-by"
                style={{ position: "relative" }}
                onClick={() => setShowSortBy(!showSortby)}
              >
                <input
                  type="text"
                  style={{ width: "100%" }}
                  disabled
                  value={sortBy}
                  className="form-group form-control"
                />

                {showSortby && (
                  <Card
                    className="options"
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      width: "100%",
                      top: "30px",
                      backgroundColor: "white",
                    }}
                  >
                    <CardBody className="main-card-body">
                      <ul>
                        <li
                          className="list-"
                          onClick={() => handleSortBy("Relevence")}
                        >
                          Relevence
                        </li>
                        <li
                          className="list-"
                          onClick={() => handleSortBy("Title")}
                        >
                          Title
                        </li>
                      </ul>
                    </CardBody>
                  </Card>
                )}
              </div>
              <JobTitleSearch job_title={job_title} setTitle={setTitle} />
              <p style={{ marginTop: "5px", position: "relative" }}>
                Job Title Level
              </p>
              {Object.keys(jobTitleLevels).length > 0 && (
                <React.Fragment>
                  {Object.keys(jobTitleLevels).map((level, index) => (
                    <label onClick={handleOnFilterChange}>
                      <input type="checkbox" value={level} />
                      <span> {level}</span>
                      <span className="text">
                        {Object.values(jobTitleLevels)[index]}
                      </span>
                    </label>
                  ))}
                </React.Fragment>
              )}
              <p style={{ marginTop: "5px", position: "relative" }}>STATES</p>
              <input
                type="text"
                style={{ width: "100%", marginBottom: "10px" }}
                placeholder="Filter states"
                className="form-group form-control"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              />

              {Object.keys(countries)
                .filter((item) => item.includes(filterCountry))
                .map((item, index) => (
                  <label onClick={handleOnFilterChange}>
                    <input
                      type="checkbox"
                      value={item}
                      checked={filterCountries.includes(item)}
                    />
                    <span> {item}</span>
                    <span className="text">
                      {Object.values(countries)[index]}
                    </span>
                  </label>
                ))}

              <p style={{ marginTop: "10px" }}>JOB COMPANY SIZE</p>
              <label for="customRange1" className="form-label">
                From {lowerRange}
              </label>
              <input
                type="range"
                className="form-range"
                max={5000}
                id="customRange1"
                onChange={(e) => setLowerRange(e.target.value)}
              ></input>
              <label for="customRange1" className="form-label">
                To {upperRange}
              </label>
              <input
                type="range"
                className="form-range"
                id="customRange1"
                // min={lowerRange + 1}
                max={5000}
                onChange={(e) => setUpperRange(e.target.value)}
              ></input>
            </div>
            <div
              className="col-sm-12 col-md-12 col-lg-9"
              style={{ padding: "20px" }}
            >
              <div className="details">
                <p style={{ flex: 1 }}>
                  Showing {skip + 1} - {parseInt(skip + _getData().length)} out
                  of {total}
                </p>
                <p style={{ marginTop: "5px" }}>Show</p>
                <div>
                  <select
                    name="cars"
                    id="cars"
                    style={{
                      padding: "5px",
                      height: "32px",
                      marginLeft: "10px",
                    }}
                    onChange={(e) => {
                      if (e.target.value == limit) return;
                      setLimit(parseInt(e.target.value));
                      limitRef.current = parseInt(e.target.value);
                    }}
                  >
                    <option value={10} selected={limitRef.current == 10}>
                      10
                    </option>
                    <option value={20} selected={limitRef.current == 20}>
                      20
                    </option>
                    <option value={30} selected={limitRef.current == 30}>
                      30
                    </option>
                    <option value={40} selected={limitRef.current == 40}>
                      40
                    </option>
                  </select>
                </div>
              </div>
              {!loading &&
                _getData().map((item, index) => (
                  <_Card item={item} _index={index} />
                ))}
              {/*    {total > 10 && _getData().length >= 10 && ( */}
              {total > 10 && (
                <div className="paginate">
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled={currentPage == 1}>
                      <PaginationLink
                        onClick={paginateMinus}
                        disabled={currentPage == 1}
                      >
                        {"<"}
                      </PaginationLink>
                    </PaginationItem>

                    {[...Array(3).keys()].map((item, index) => (
                      <PaginationItem
                        active={lowerIndex + index + 1 == currentPage}
                      >
                        <PaginationLink disabled={true}>
                          {lowerIndex + index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem disabled={skip + limitRef.current >= total}>
                      <PaginationLink
                        onClick={paginatePlus}
                        disabled={skip + limitRef.current >= total}
                      >
                        {">"}
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        )}{" "}
      </div>
    </React.Fragment>
  );
};
