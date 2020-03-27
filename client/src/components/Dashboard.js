import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

import { useParams, useHistory } from "react-router-dom";

const Dashboard = () => {
  const [jokes, setJokes] = useState([]);

  const { id } = useParams();
  const history = useHistory();

  // const fetchUser = () => {
  //   axiosWithAuth()
  //     .get(`users/${id}`)
  //     .then((res) => {
  //       setUser(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };
  const getJokes = () => {
    axiosWithAuth()
      .get("jokes")
      .then((res) => {
        console.log("successful jokes", res);
        setJokes(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getJokes();
  }, []);

  // const routeToUserEdit = (e, user) => {
  //   e.preventDefault();
  //   history.push(`/users/${user.id}/edits`);
  // };

  return (
    <div className="users-container">
      {jokes.map((joke) => (
        <div key={joke.id}>
          <p> {joke.joke} </p>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;
