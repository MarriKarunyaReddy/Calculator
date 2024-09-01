import { ACTION_TYPES } from "./Calculator";

export default function NumButton({ dispatch, num }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTION_TYPES.APPEND_NUM, payload: { num } })}
    >
      {num}
    </button>
  );
}
