exports.field = function(name) {
  return new Field(name);
}

exports.AndExpression = AndExpression;
exports.OrExpression = OrExpression;
exports.ValueComparison = ValueComparison;
exports.FieldComparison = FieldComparison;

/**
 * QueryExpression
 */
function QueryExpression() {
}

QueryExpression.prototype.and = function(expression) {
	return new AndExpression(this, expression);
};

QueryExpression.prototype.or = function(expression) {
  return new OrExpression(this, expression);
};

/**
 * NaryLogicalExpression
 */
function NaryLogicalExpression(op, expressions) {
  if (!(expressions instanceof Array)) {
    throw new Error("Expected array of expressions, got " + expressions);
  }

  this[op] = expressions;
}

NaryLogicalExpression.prototype = Object.create(QueryExpression.prototype);
NaryLogicalExpression.prototype.constructor = NaryLogicalExpression;

/**
 * AndExpression
 */
function AndExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$and", expressions);
}

AndExpression.prototype = Object.create(NaryLogicalExpression.prototype);
AndExpression.prototype.constructor = AndExpression;

AndExpression.prototype.and = function(expression) {
  return new AndExpression(this.expressions.concat(expression));
};

/**
 * OrExpression
 */
function OrExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$or", expressions);
}

OrExpression.prototype = Object.create(NaryLogicalExpression.prototype);
OrExpression.prototype.constructor = OrExpression;

OrExpression.prototype.or = function(expression) {
  return new OrExpression(this.expressions.concat(expression));
};

/**
 * Field
 */
function Field(field) {
	this.field = field;
}

Field.prototype._comparison = function(op, value) {
  if (value instanceof Field) {
    return new FieldComparison(this.field, op, value.field);
  }

  return new ValueComparison(this.field, op, value);
};

Field.prototype.equalTo = Field.prototype.eq = function(value) {
	return this._comparison("$eq", value);
};

Field.prototype.greaterThan = Field.prototype.gt = function(value) {
  return this._comparison("$gt", value);
};

/**
 * FieldComparison
 */
function FieldComparison(field, op, rfield) {
	this.field = field;
  this.op = op;
  this.rfield = rfield;
}

FieldComparison.prototype = Object.create(QueryExpression.prototype);
FieldComparison.prototype.constructor = FieldComparison;

/**
 * ValueComparison
 */
function ValueComparison(field, op, rvalue) {
  this.field = field;
  this.op = op;
  this.rvalue = rvalue;
}

ValueComparison.prototype = Object.create(QueryExpression.prototype);
ValueComparison.prototype.constructor = ValueComparison;