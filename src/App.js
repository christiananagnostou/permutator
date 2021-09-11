import { useState } from "react";
import "./App.css";
import cloneDeep from "lodash/cloneDeep";
import update from "immutability-helper";

import { createPermutations } from "./permutate";

function App() {
  const [videos, setVideos] = useState([]);
  const [inputVideo, setInputVideo] = useState({ title: "", fixed: false });
  const [permutations, setPermutations] = useState([]);
  const [displayCount, setDisplayCount] = useState(100);

  const addVideo = (e) => {
    e.preventDefault();
    if (!inputVideo.title) return;

    setVideos([...videos, inputVideo]);
    setVideos(update(videos, { $push: [inputVideo] }));

    setInputVideo({ title: "", fixed: false });
  };

  const handlePermutate = () => {
    const clone = cloneDeep(videos);
    const perms = createPermutations(clone);
    console.log(perms);
    setPermutations(perms);
  };

  const handleVideoFixedChange = (index) => {
    setVideos(update(videos, { [index]: { fixed: { $set: !videos[index].fixed } } }));
  };

  const getNumPermutations = () => {
    function factorialize(num) {
      if (num === 0) return 1;
      else return num * factorialize(num - 1);
    }

    const videosNotFixed = videos.filter((video) => !video.fixed);

    const count = factorialize(videosNotFixed.length);

    return count;
  };

  const createCSVText = () => {
    const res = [];

    for (let i = 0; i < permutations.length; i++) {
      const row = [];
      for (let j = 0; j < permutations[i].length; j++) {
        row.push(permutations[i][j].title);
      }
      res.push(row.join(" ") + "\n");
    }

    const text = res.join("");

    const CSV = encodeURI("data:text/csv;charset=utf-8," + text);

    console.log(CSV);

    window.open(CSV);

    var hiddenElement = document.createElement("a");
    hiddenElement.href = CSV;
    hiddenElement.target = "_blank";
    hiddenElement.download = "permutations.csv";
    hiddenElement.click();
  };

  return (
    <div className="app">
      <h1 className="title">Permutator</h1>

      <form onSubmit={addVideo} className="form">
        <div className="input-container">
          <div>
            <label htmlFor="fileName">Title:</label>
            <input
              type="text"
              name="fileName"
              required={true}
              value={inputVideo.title}
              onChange={(e) => setInputVideo({ ...inputVideo, title: e.target.value })}
              onFocus={() => setDisplayCount(100)}
            />
          </div>
          <div>
            <label htmlFor="fixed">Fixed:</label>
            <input
              type="checkbox"
              name="fixed"
              checked={inputVideo.fixed}
              onChange={() => setInputVideo({ ...inputVideo, fixed: !inputVideo.fixed })}
            />
          </div>
        </div>
        <button type="submit">Add</button>
      </form>

      <ul className="videos">
        {videos.map((video, i) => (
          <li key={video.title + i}>
            <p>{video.title}</p>
            <input
              type="checkbox"
              name="fixed"
              checked={video.fixed}
              onChange={() => handleVideoFixedChange(i)}
            />
          </li>
        ))}
      </ul>

      {Boolean(videos.length) && (
        <>
          <p>Permutation count: {getNumPermutations()}</p>
          <button onClick={handlePermutate} className="permutate-btn">
            PERMUTATE
          </button>
        </>
      )}

      <div className="list-controls">
        Limit rows to:
        <button
          onClick={() => setDisplayCount(100)}
          className={displayCount === 100 ? "btn-highlight" : ""}
        >
          100
        </button>
        <button
          onClick={() => setDisplayCount(1000)}
          className={displayCount === 1000 ? "btn-highlight" : ""}
        >
          1000
        </button>
        <button
          onClick={() => setDisplayCount(10000)}
          className={displayCount === 10000 ? "btn-highlight" : ""}
        >
          10000
        </button>
        <button
          onClick={() => setDisplayCount(permutations.length)}
          className={displayCount === permutations.length ? "btn-highlight" : ""}
        >
          All
        </button>
        <span>{" <- be careful"}</span>
      </div>

      {Boolean(permutations.length) && (
        <button onClick={createCSVText} className="download-btn">
          Download as CSV
        </button>
      )}

      {Boolean(permutations.length) && (
        <ul className="permitation-list">
          {permutations.slice(0, displayCount).map((each, i) => (
            <ul className="permutation-row">
              <p>{i + 1}) </p>
              {each.map((video) => (
                <li className="permutation">
                  <p>{video.title}</p>
                </li>
              ))}
            </ul>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
