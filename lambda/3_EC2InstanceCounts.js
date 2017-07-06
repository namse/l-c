// 3.구동중인 EC2 인스턴스의 타입 별 갯수를 출력하는 람다 함수와 Role 만들기

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

function sortEC2Instances(instances) {
  return instances.map(instance => instance.InstanceType)
  .reduce((ec2InstanceTypeAndCounts, type) => {
    ec2InstanceTypeAndCounts[type] =
      ec2InstanceTypeAndCounts[type]
      ? ec2InstanceTypeAndCounts[type] + 1
      : 1;
    return ec2InstanceTypeAndCounts;
  }, {});
}

exports.handler = (event, context, callback) => {
  getInstnaces()
  .then(instances => sortEC2Instances(instances))
  .then(ec2InstanceTypeAndCounts => {
    console.log(ec2InstanceTypeAndCounts);
    callback(null, ec2InstanceTypeAndCounts);
  })
  .catch(err => {
    console.log(err, err.stack);
    callback(err);
  });
};
