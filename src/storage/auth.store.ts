class Auth {
  userId = '';

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}

export const session = new Auth();
