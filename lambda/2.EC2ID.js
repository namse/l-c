// 2. 현재 Account의 구동중인 EC2의 ID를 출력하는 람다 함수와 Role 만들기

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

function getInstnaces(nextToken, callback) {
  const params = {
    NextToken: nextToken,
  };
  ec2.describeInstances(params, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    const instances = [];
    data.Reservations.forEach(reservation =>
      reservation.Instances.forEach(instance =>
        instances.push(instance)));
    if (data.NextToken) {
      getInstnaces(data.NextToken, (err, nextInstances) => {
        callback(err, [...instances, ...nextInstances]);
      })
    } else {
      callback(err, instances);
    }
  });
}

exports.handler = (event, context, callback) => {
  getInstnaces(null, (err, instances) => {
    callback(err, instances);
  })
};
