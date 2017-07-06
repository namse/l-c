// 2. 현재 Account의 구동중인 EC2의 ID를 출력하는 람다 함수와 Role 만들기

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

function getInstnaces(nextToken) {
  const params = {
    NextToken: nextToken,
  };
  return ec2.describeInstances(params).promise()
  .then((data) => {
    const instances = [];
    data.Reservations.forEach(reservation =>
      reservation.Instances.forEach(instance =>
        instances.push(instance)));
    if (data.NextToken) {
      return getInstnaces(data.NextToken)
      .then(nextInstances => [...instances, ...nextInstances]);
    } else {
      return instances;
    }
  });
}

exports.handler = (event, context, callback) => {
  getInstnaces()
  .then(instances => callback(null, instances))
  .catch(err => {
    console.log(err, err.stack);
    callback(err);
  });
};
