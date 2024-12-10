class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // this.req = req;
  }
  filter() {
    const queryObj = { ...this.queryString }; //created a shallow copy of the req.query
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((el) => {
      delete queryObj[el];
    });

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    console.log(JSON.parse(queryString));
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1; // seting the default page value to 1
    const limit = this.queryString.limit * 1 || 100; // seting the default limit value to 100
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
