import { useReducer } from "react";
import NumButton from "./NumButton";
import OpButton from "./OpButton";
import "./styles.css";

export const ACTION_TYPES = {
  APPEND_NUM: "append-num",
  SELECT_OP: "select-op",
  RESET: "reset",
  REMOVE_DIGIT: "remove-digit",
  CALCULATE: "calculate",
};


function calculatorReducer(state, { type, payload }) {
  switch (type) {
    case ACTION_TYPES.APPEND_NUM:
      if (state.isOverwrite) {
        return {
          ...state,
          currentVal: payload.num,
          isOverwrite: false,
        };
      }
      if (payload.num === "0" && state.currentVal === "0") return state;
      if (payload.num === "." && state.currentVal?.includes(".")) return state;

      return {
        ...state,
        currentVal: `${state.currentVal || ""}${payload.num}`,
      };
    case ACTION_TYPES.SELECT_OP:
      if (!state.currentVal && !state.previousVal) return state;

      if (!state.currentVal) {
        return {
          ...state,
          operation: payload.op,
        };
      }

      if (!state.previousVal) {
        return {
          ...state,
          operation: payload.op,
          previousVal: state.currentVal,
          currentVal: null,
        };
      }

      return {
        ...state,
        previousVal: performCalculation(state),
        operation: payload.op,
        currentVal: null,
      };
    case ACTION_TYPES.RESET:
      return {};
    case ACTION_TYPES.REMOVE_DIGIT:
      if (state.isOverwrite) {
        return {
          ...state,
          isOverwrite: false,
          currentVal: null,
        };
      }
      if (!state.currentVal) return state;
      if (state.currentVal.length === 1) {
        return { ...state, currentVal: null };
      }

      return {
        ...state,
        currentVal: state.currentVal.slice(0, -1),
      };
    case ACTION_TYPES.CALCULATE:
      if (
        !state.operation ||
        !state.currentVal ||
        !state.previousVal
      ) {
        return state;
      }

      return {
        ...state,
        isOverwrite: true,
        previousVal: null,
        operation: null,
        currentVal: performCalculation(state),
      };
    default:
      return state;
  }
}

function performCalculation({ currentVal, previousVal, operation }) {
  const prev = parseFloat(previousVal);
  const current = parseFloat(currentVal);
  if (isNaN(prev) || isNaN(current)) return "";
  let result = "";
  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
    default:
      return "";
  }

  return result.toString();
}

const FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatValue(value) {
  if (value == null) return;
  const [intPart, decPart] = value.split(".");
  if (decPart == null) return FORMATTER.format(intPart);
  return `${FORMATTER.format(intPart)}.${decPart}`;
}

function Calculator() {
  const [{ currentVal, previousVal, operation }, dispatch] = useReducer(
    calculatorReducer,
    {}
  );

  return (
    <div className="calculator-container">
      <div className="output">
        <div className="prev-val">
          {formatValue(previousVal)} {operation}
        </div>
        <div className="curr-val">{formatValue(currentVal)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION_TYPES.RESET })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION_TYPES.REMOVE_DIGIT })}>
        DEL
      </button>
      <OpButton operation="÷" dispatch={dispatch} />
      <NumButton num="1" dispatch={dispatch} />
      <NumButton num="2" dispatch={dispatch} />
      <NumButton num="3" dispatch={dispatch} />
      <OpButton operation="*" dispatch={dispatch} />
      <NumButton num="4" dispatch={dispatch} />
      <NumButton num="5" dispatch={dispatch} />
      <NumButton num="6" dispatch={dispatch} />
      <OpButton operation="+" dispatch={dispatch} />
      <NumButton num="7" dispatch={dispatch} />
      <NumButton num="8" dispatch={dispatch} />
      <NumButton num="9" dispatch={dispatch} />
      <OpButton operation="-" dispatch={dispatch} />
      <NumButton num="." dispatch={dispatch} />
      <NumButton num="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION_TYPES.CALCULATE })}
      >
        =
      </button>
    </div>
  );
}

export default Calculator;
