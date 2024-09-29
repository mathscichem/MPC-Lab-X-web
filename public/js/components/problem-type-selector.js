/**
 * @file public/js/components/problem-type-selector.js
 * @description Problem type selector component.
 */

class ProblemTypeSelector {
  /**
   * @constructor - Initializes the ProblemTypeSelector class.
   * @param {HTMLElement} element - The element to bind the component to.
   * @param {Object} problemIndex - The problem index.
   */
  constructor(element, problemIndex) {
    this.element = element;
    this.renderElement = element.querySelector("#problem-type-selector-list");
    this.headerElement = element.querySelector("#problem-type-selector-title");
    this.descriptionElement = element.querySelector(
      "#problem-type-selector-description"
    );
    this.selectButton = element.querySelector("#problem-type-selector-select");
    this.problemIndex = problemIndex;

    this.toggledTopics = new Set();
    this.selectedProblemPath = null;
    this.selectPromises = [];

    this.render();
  }

  /**
   * @function render - Renders the component.
   */
  render() {
    // DON'T REMOVE (TAILWIND CLASS-NAME): bg-primary-100 bg-primary-200 bg-primary-300 bg-primary-400 hover:bg-primary-200 hover:bg-primary-300 hover:bg-primary-400 hover:bg-primary-500
    const renderTopics = (topic, parentElement, currentPath) => {
      const currentLevel = currentPath.length;

      const topicElement = document.createElement("button");
      const subTopicsElement = document.createElement("ul");
      subTopicsElement.className = "ml-4 hidden";

      if (topic.topics) {
        topicElement.innerHTML = topic.name;
        topicElement.className = `w-full text-left mt-2 py-2 px-4 bg-primary-${
          currentLevel <= 4 ? currentLevel : 4
        }00 rounded hover:bg-primary-${
          currentLevel <= 4 ? currentLevel + 1 : 5
        }00 transition duration-300`;
        topicElement.addEventListener("click", () => {
          this.toggleTopic(subTopicsElement);
        });

        for (const subTopic in topic.topics) {
          const subTopicElement = document.createElement("li");
          subTopicElement.className = "relative";

          renderTopics(topic.topics[subTopic], subTopicElement, [
            ...currentPath,
            subTopic,
          ]);

          subTopicsElement.appendChild(subTopicElement);
        }
      } else {
        topicElement.innerHTML = topic.name;
        topicElement.className = `w-full text-left mt-2 py-2 px-4 bg-primary-${
          currentLevel <= 4 ? currentLevel : 4
        }00 rounded hover:bg-primary-${
          currentLevel <= 4 ? currentLevel + 1 : 5
        }00 transition duration-300`;
        topicElement.addEventListener("click", () => {
          this.toggleProblemType(topic, currentPath);
        });
      }

      parentElement.appendChild(topicElement);
      parentElement.appendChild(subTopicsElement);
    };

    for (const topic in this.problemIndex) {
      const topicElement = document.createElement("li");
      renderTopics(this.problemIndex[topic], topicElement, [topic]);
      this.renderElement.appendChild(topicElement);
    }
  }

  /**
   * @function toggleTopic - Toggles the topic.
   * @param {HTMLElement} subTopicsElement - The sub topics element.
   */
  toggleTopic(subTopicsElement) {
    subTopicsElement.classList.toggle("hidden");
    this.toggledTopics.add(subTopicsElement);
  }

  /**
   * @function toggleProblemType - Toggles the problem type.
   * @param {Object} problemType - The problem type to toggle.
   * @param {Array} problemPath - The problem path.
   */
  toggleProblemType(problemType, problemPath) {
    const parentElement = this.headerElement.parentElement;

    this.headerElement.textContent = problemType.name;
    this.descriptionElement.textContent = problemType.description;
    parentElement.classList.remove("hidden");
    parentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    this.selectButton.classList.remove("hidden");

    this.selectedProblemPath = problemPath;
  }

  /**
   * @function show - Shows the component.
   * @returns {Promise<Array>} The problem path.
   */
  async show() {
    this.element.classList.remove("hidden");

    return new Promise((resolve, reject) => {
      this.selectPromises.push({ resolve, reject });
    });
  }

  /**
   * @function hide - Hides the component.
   */
  hide() {
    this.element.classList.add("hidden");

    for (const selectPromise of this.selectPromises) {
      selectPromise.reject();
    }

    for (const toggledTopic of this.toggledTopics) {
      toggledTopic.classList.add("hidden");
    }
    this.toggledTopics = new Set();
    this.headerElement.textContent = "";
    this.descriptionElement.textContent = "";

    this.selectedProblemPath = null;
    this.selectPromises = [];
  }

  /**
   * @function select - Problem type selected.
   */
  select() {
    for (const selectPromise of this.selectPromises) {
      selectPromise.resolve(this.selectedProblemPath);
    }

    this.selectPromises = [];

    this.hide();
  }
}
