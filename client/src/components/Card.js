import React from "react";

export const _Card = ({ item, _index }) => {
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px",
        }}
        className="card"
      >
        <h6
          style={{
            color: "#3A56E4",
            paddingLeft: "10px",
            paddingBottom: "0px",
            paddingTop: "5px",
          }}
        >
          <a
            // href={item.nps_link.raw}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            {item ? (item.job_title ? item.job_title : "") : ""}
          </a>
        </h6>

        <div
          key={_index}
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "5px",
            }}
          >
            <div>
              <span className="detail-"> "id" </span>
              <span> : </span> <span className="detail-span">{item.id}</span>
            </div>
            <div>
              <span className="detail-"> "full_name" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.full_name}</span>
            </div>
            <div>
              <span className="detail-"> "linkedin_url" </span>
              <span> : </span>{" "}
              <a href={`https://${item.linkedin_url}`} target="_blank">
                <span className="detail-span">{item.linkedin_url}</span>
              </a>
            </div>
            <div>
              <span className="detail-"> "industry" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.industry}</span>
            </div>
            <div>
              <span className="detail-"> "location_country" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.location_country}</span>
            </div>
            <div>
              <span className="detail-"> "inferred_salary" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.inferred_salary}</span>
            </div>
            <div>
              <span className="detail-"> "inferred_years_experience" </span>
              <span> : </span>{" "}
              <span className="detail-span">
                {item.inferred_years_experience}
              </span>
            </div>
            <div>
              <span className="detail-"> "job_title" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.job_title}</span>
            </div>
            <div>
              <span className="detail-"> "job_company_size" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.job_company_size}</span>
            </div>
            <div>
              <span className="detail-"> "job_company_industry" </span>
              <span> : </span>{" "}
              <span className="detail-span">{item.job_company_industry}</span>
            </div>
            <div>
              <span className="detail-"> "job_company_location_country" </span>
              <span> : </span>{" "}
              <span className="detail-span">
                {item.job_company_location_country}
              </span>
            </div>
            <div>
              <span className="detail-"> "job_company_website" </span>
              <span> : </span>
              <a href={`http://${item.job_company_website}`} target="_blank">
                <span className="detail-span">{item.job_company_website}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
