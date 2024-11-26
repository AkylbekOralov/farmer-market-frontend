// Components/Admin/AdminMain.js
import { useNavigate } from "react-router-dom";

const AdminMain = () => {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/farmers-list")}>
        Unverified farmers list
      </button>

      <button onClick={() => navigate("/category-control")}>
        Category Control
      </button>
    </>
  );
};

export default AdminMain;
