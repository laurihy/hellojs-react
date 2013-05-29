/**
 * @jsx React.DOM
 */


    var Timer = React.createClass({
      getInitialState: function() {
        return {secondsElapsed: 0};
      },
      tick: React.autoBind(function() {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1});
      }),
      componentDidMount: function() {
        setInterval(this.tick, 1000);
      },
      render: function() {
        return (
          <div>
            {'Seconds Elapsed: ' + this.state.secondsElapsed}
          </div>
        );
      }
    });

    React.renderComponent(<Timer />, document.getElementById('timer'));