import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{background:'#fff',height:'600px',textAlign:'center', display: 'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
        <b style={{fontSize:'24px',color:'#ccc', flex: '1'}}>首页建设中，敬请期待......</b>
      </div>
    );
  }
}

export default Home;
