import "../Style.css";

function Control(props) {
    const components = [
      { name: "Basic Animation", key: "animation" },
      { name: "Dog walk to English Bay", key: "direction" },
      { name: "Dogs on Street", key: "pins" },
      { name: "Text in the Air", key: "text" },
    ];
  const renderedList = components.map((component) => {
    return (
      <li key={component.key}>
        <button onClick={() => props.setCurrentComponent(component.key)}>
          {component.name}
        </button>
      </li>
    );
  });
  //   };

  return (
    <div className="control">
      <ul>{renderedList}</ul>
    </div>
  );
}

export default Control;
