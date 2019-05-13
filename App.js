import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native';
import {
    Icon, Left, Right,
    Header, Content, Container,
    Text, Body, Card, CardItem,
    Button
} from 'native-base';

// import { graphql, ApolloProvider } from 'react-apollo';

import gql from 'graphql-tag';
// import ApolloClient from 'apollo-client';
import ApolloClient from 'apollo-boost';
// const networkInterface = createNetworkInterface({
//     uri: 'https://graph.qa.f1.flexdrive.com/'
// });

const client = new ApolloClient({
    uri: 'https://graph.qa.f1.flexdrive.com/',
});

export default class App extends Component {
    state = {
        vehicles: []
    }

    componentDidMount() {
        client.query({
            query: gql`
                query Vehicles($skip: Int! = 0, $take: Int! = 10) {
                    vehicles(query: { skip: $skip, take: $take }) {
                    edges {
                        node {
                        id
                        year
                        make
                        trim
                        model
                        rideshareEligible
                        pricing {
                            value
                            duration
                            durationUnit
                        }
                        location {
                            id
                            name
                        }
                        featureImage {
                            url
                        }
                        }
                    }
                    totalCount
                    pageInfo {
                        hasNextPage
                    }
                    }
              }
            `
        }).then(({data}) => {
            this.setState({
                vehicles: data.vehicles.edges,
                totalCount: data.vehicles.totalCount
            })
        })
        .catch(error => {
            console.error(error)
            alert('error');
        });
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#f3f4f9' }}>
                <View style={{
                    flexDirection: 'row',
                    height: 56,
                    marginTop: 40,
                    marginHorizontal: 10,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View>
                        <Icon name='arrow-back' />
                    </View>
                    <View>
                        <Text style={{fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center'}}>{this.state.totalCount} CARS FOUND</Text>
                        <Text style={{fontSize: 11, textTransform: 'uppercase'}}><Icon name='send'  style={{ fontSize: 13, fontWeight: 'bold' }} /> ATLANTA, GA</Text>
                    </View>
                    <View>
                    <View style={{
                        width: 90,
                        height: 40,
                        flexDirection: 'row',
                        borderWidth: 1,
                        padding: 5,
                        borderRadius: 6,
                        justifyContent: 'space-around',
                        marginHorizontal: 5,
                        alignItems: 'center'}}>
                        <Icon name='options'  style={{ fontSize: 13, fontWeight: 'bold' }} />
                        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>FILTERS</Text>
                    </View>
                    </View>
                </View>
                <View style={styles.greenBar}>
                    <Text style={{ color: 'white', fontSize: 12 }}>The price includes insurance, maintenance & Road Side.</Text>
                    <Icon name='close-circle-outline' style={{ fontSize: 13, color: 'white', fontWeight: 'bold' }}/>
                </View>
                <Content>
                    {this.state.vehicles.map((vehicle, index) => (
                        <Card key={index}>
                        <CardItem cardBody>
                            <Image
                                source={{uri: vehicle.node.featureImage.url }}
                                style={{height: 200, width: null, flex: 1}}
                            />
                        </CardItem>
                        <CardItem style={{ flexDirection: 'row', paddingVertical: 20, marginVertical: 10}}>
                            <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 15}}>{vehicle.node.year} {vehicle.node.model}</Text>
                            <Text style={{ fontSize: 10, color: 'grey' }}>at {vehicle.node.location.name}</Text>
                            </View>
                            <View style={[styles.purpleBox, {
                                position: 'absolute', right: 10,
                                width: 100,
                                height: 50,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center'
                                }]}>
                                <Text style={{ color: 'white', fontWeight: 'bold'}}>${vehicle.node.pricing[0].value}</Text>
                                <Text style={{ color: 'white', fontSize: 11}}>for {vehicle.node.pricing[0].duration} days</Text>
                            </View>
                        </CardItem>
                        </Card>
                    ))}

                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    greenBar: {
        backgroundColor: '#57af71',
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    purpleBox: {
        backgroundColor: '#561c86',
    }
});

// export default class App extends Component {
//     render() {
//         return (
//             <ApolloProvider client={client}>
//                 <Home />
//             </ApolloProvider>
//         )
//     }
// }