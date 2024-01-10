class UserDto {
  id;
  name;
  lastname;
  email;
  role;
  isActivated;
  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.lastname = model.lastname;
    this.email = model.email;
    this.role = model.role;
    this.isActivated = model.isActivated;
  }
}

export default UserDto
