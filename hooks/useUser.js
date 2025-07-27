import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserById,
  changePassword,
  resetUserState,
} from "../feartures/user/userSlice";

const useUser = () => {
  const dispatch = useDispatch();

  const {
    updatedUser,
    changePasswordResult,
    isUpdating,
    isChangingPassword,
    error,
  } = useSelector((state) => state.user);

  const updateUser = useCallback(
    async (payload) => {
      try {
        const res = await dispatch(updateUserById(payload)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const changeUserPassword = useCallback(
    async (passwordData) => {
      try {
        const res = await dispatch(changePassword(passwordData)).unwrap();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [dispatch]
  );

  const resetUser = useCallback(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  return {
    updateUser,
    changeUserPassword,
    resetUser,
    updatedUser,
    changePasswordResult,
    isUpdating,
    isChangingPassword,
    error,
  };
};

export default useUser;
