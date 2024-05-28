export const validationRules = {
  isFieldRequired: function (model) {
    return !!model || "Field is required"
  },
}
