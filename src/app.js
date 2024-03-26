// load pinecone router
import questions from "./eval.json";
import PineconeRouter from "pinecone-router";
import Alpine from "alpinejs";
import * as utils from "./util";
import evaluations from "./stores/evaluations";

Alpine.plugin(PineconeRouter);

Alpine.store("utils", utils);

Alpine.store("questions", questions);

Alpine.store("evaluations", evaluations);

document.addEventListener('DOMContentLoaded', () => {
  Alpine.start();
});

