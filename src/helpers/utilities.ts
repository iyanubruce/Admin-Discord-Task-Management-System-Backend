export const itemResponse = (
  payload: any,
  p0: number,
  message = "success"
): any => ({
  status: true,
  message,
  data: payload,
});
