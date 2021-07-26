import { Dimmer, Segment, Loader } from "semantic-ui-react";

export default function LoadingDimmer({ complete, error }) {
  const RenderSwitchErrors = () => {
    switch (error.code) {
      case 400:
        return <h3>Your request could not be understood due to bad syntax.</h3>;
      case 401:
        return (
          <h3>
            Your request requires user authentication and you were not
            authorized.
          </h3>
        );
      case 403:
        return <h3>Your request is forbidden.</h3>;
      case 404:
        return <h3>Your request does not exist or was not found.</h3>;
      case 500:
      default:
        return (
          <h3>
            Sorry, the server is down... We will fix it as soon as possible
          </h3>
        );
    }
  };

  return (
    <>
      {!complete && (
        <Dimmer active={!complete} page>
          <Loader>Loading products, just a moment...</Loader>
        </Dimmer>
      )}
      {complete && error && (
        <Dimmer active={true} page>
          <RenderSwitchErrors />
          <h3>{error.code}</h3>
          <h4>{error.msg}</h4>
        </Dimmer>
      )}
    </>
  );
}
