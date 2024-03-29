import "./style.css";
import { csvToData, generateGraph, readFileContent } from "./utils";
import exampleCsv from "../assets/example.csv?raw";

const $uploader = document.querySelector(".uploader");
const $viewer = document.querySelector(".viewer");
const $graphContainer = $viewer.querySelector(".graph-container");

$uploader.style.display = "block";
$viewer.style.display = "none";

document
  .querySelector("input[type=file]")
  .addEventListener("change", async (event) => {
    let fileContent = "";

    try {
      fileContent = await readFileContent(event.target.files[0]);
    } catch (e) {
      alert(`Problem with opening file: ${e.toString()}`);
    }

    event.target.value = null;
    $uploader.style.display = "none";
    $viewer.style.display = "block";

    const { labels, rows } = csvToData(fileContent);
    generateGraph($graphContainer, labels, rows);
  });

if (window.location.search === "?test") {
  $uploader.style.display = "none";
  $viewer.style.display = "block";

  const { labels, rows } = csvToData(exampleCsv);
  generateGraph($graphContainer, labels, rows);
}
