import { ACTION_TYPES } from "./Calculator";

export default function OpButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTION_TYPES.SELECT_OP, payload: { op: operation } })
      }
    >
      {operation}
    </button>
  );
}
