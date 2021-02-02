
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, matchPath } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, Tag, Button } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import ReactPlayer from 'react-player';
import { DynamicHtml, Spinner } from 'components';
import { GET_INITIATIVES } from 'graphql/queries';
import { randomKeys } from 'utilities/utils';
import AddInitiative from 'pages/Products/AddInitiative';
import { getProp } from 'utilities/filters';

type Params = {
  productSlug?: any
  userRole?: string;
  match: any;
} & RouteComponentProps;

const InitiativeList: React.SFC<Params> = ({ history, location, match, userRole }) => {
  const params: any = matchPath(match.url, {
    path: "/products/:productSlug/initiatives",
    exact: false,
    strict: false
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const { data, error, loading, refetch } = useQuery(GET_INITIATIVES, {
    variables: { productSlug: params.params.productSlug }
  });

  const goToDetails = (id: number) => {
    history.push(`${match.url}/${id}`);
  }

  const fetchData = async () => {
    const { data: newData } = await refetch({
      productSlug: params.params.productSlug
    });

    setInitiatives(newData.initiatives)
  }

  useEffect(() => {
    if (data) {
      setInitiatives(data.initiatives);
    }
  }, [data]);


  if(loading) return <Spinner/>

  return (
    <>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <Col>
                <div className="page-title text-center">
                  { initiatives
                      ? `Explore ${initiatives.length} initiatives`
                      : 'No initiatives'
                  }
                </div>
              </Col>
              {(userRole === "Manager" || userRole === "Admin") && (
                <Col>
                  <Button
                    onClick={() => setShowEditModal(!showEditModal)}
                  >
                    Add new initiative
                  </Button>
                </Col>
              )}
            </Row>
            <Row gutter={[16, 16]}>
            {
              initiatives && initiatives.map((initiative: any, idx: number) => (
                <Col key={randomKeys()} xs={24} sm={12} md={8}>
                  {/* <Card
                    cover={
                      <ReactPlayer
                        width="100%"
                        height="172px"
                        url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                      />
                    }
                  > */}
                  <Card>
                    <div
                      className='pointer'
                      onClick={() => goToDetails(initiative.id)}
                    >
                      <div>
                      <h4 className='mt-5'>{initiative.name}</h4>
                        <DynamicHtml
                          text={getProp(initiative, 'description', '')}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            }
            {
              showEditModal && <AddInitiative
                modal={showEditModal}
                productSlug={params.params.productSlug}
                modalType={false}
                closeModal={setShowEditModal}
                submit={fetchData}
              />
            }
            </Row>
          </React.Fragment >
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = (dispatch: any) => ({
});

const InitiativeListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeList);

export default withRouter(InitiativeListContainer);