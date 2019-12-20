from django.http import HttpResponse
from django.shortcuts import render
import pandas_gbq
from google.oauth2 import service_account
from datetime import datetime

# Make sure you have installed pandas-gbq at first;
# You can use the other way to query BigQuery.
# please have a look at
# https://cloud.google.com/bigquery/docs/reference/libraries#client-libraries-install-nodejs
# To get your credential

credentials = service_account.Credentials.from_service_account_file('C:/Users/chen/Desktop/big data/project/web/big data-6fddd3b6f65e.json')

def hotzone(request):
    data = {}
    return render(request, 'map5.html', data)

def basic(request):
    data = {}
    pandas_gbq.context.credentials = credentials
    pandas_gbq.context.project = "linen-surface-252923"
    SQL3 = "select Time,count_14,count_15,count_16,count_17,count_18 from project.time_data order by seq asc"
    data = {}
    df3 = pandas_gbq.read_gbq(SQL3)
    dic = df3.to_dict(orient='records')

    for item in dic:
        item['count'] = {}
        for k, v in item.items():
            if k != 'Time' and k != 'count':
                item['count'][k] = v
            # if k == 'Time':
            #     item['Time'] = v.strftime('%H:%M')

    for item in dic:
        # item['Time'] = item.pop('time')
        del (item['count_14'])
        del (item['count_15'])
        del (item['count_16'])
        del (item['count_17'])
        del (item['count_18'])
        item["count"]["year2014"] = item["count"].pop("count_14")
        item["count"]["year2015"] = item["count"].pop("count_15")
        item["count"]["year2016"] = item["count"].pop("count_16")
        item["count"]["year2017"] = item["count"].pop("count_17")
        item["count"]["year2018"] = item["count"].pop("count_18")
    data = {'data': dic}
    return render(request, 'basicanalysis.html', data)

def correlation(request):
    pandas_gbq.context.credentials = credentials
    pandas_gbq.context.project = "linen-surface-252923"

    SQL = "select accident_numbers, weather from project.weather_fog"
    df = pandas_gbq.read_gbq(SQL)
    tmp = df.values
    fog = []
    nofog = []
    for item in tmp:
        if item[1]=='fog':
            fog.append(item[0])
        else:
            nofog.append(item[0])

    SQL2 = "select 	double_field_1, double_field_2 from project.weather_visi"
    df2 = pandas_gbq.read_gbq(SQL2)
    tmp2 = df2.values
    visx = []
    visy = []
    for item in tmp2:
        if item[0]!=0:
            visx.append(item[0])
            visy.append(item[1])

    SQL3 = "select Time,count_14,count_15,count_16,count_17,count_18 from project.time_data order by seq asc"
    data = {}
    df3 = pandas_gbq.read_gbq(SQL3)
    dic = df3.to_dict(orient='records')

    for item in dic:
        item['count'] = {}
        for k, v in item.items():
            if k != 'Time' and k != 'count':
                item['count'][k] = v
            # if k == 'Time':
            #     item['Time'] = v.strftime('%H:%M')

    for item in dic:
        # item['Time'] = item.pop('time')
        del (item['count_14'])
        del (item['count_15'])
        del (item['count_16'])
        del (item['count_17'])
        del (item['count_18'])
        item["count"]["year2014"] = item["count"].pop("count_14")
        item["count"]["year2015"] = item["count"].pop("count_15")
        item["count"]["year2016"] = item["count"].pop("count_16")
        item["count"]["year2017"] = item["count"].pop("count_17")
        item["count"]["year2018"] = item["count"].pop("count_18")
    data = {'fog': fog, 'nofog': nofog,'x': visx, 'y': visy, 'data': dic}

    return render(request, 'correlation.html', data)

def dashboard(request):
    pandas_gbq.context.credentials = credentials
    pandas_gbq.context.project = "linen-surface-252923"

    SQL = "select * from bigdata_sparkStreaming.wordsummary2 limit 8"
    df = pandas_gbq.read_gbq(SQL)
    tmp = df.values
    tmp2 = []
    for i in range(len(tmp)):
        tmpdict = {'Time': tmp[i][0].strftime("%H:%M"), 'count': {'ai': tmp[i][1], 'data': tmp[i][2], 'good': tmp[i][3], 'movie': tmp[i][4], 'spark': tmp[i][5]}}
        tmp2.append(tmpdict)
    data = {'data': tmp2}
    #print(data)

    '''
        TODO: Finish the SQL to query the data, it should be limited to 8 rows. 
        Then process them to format below:
        Format of data:
        {'data': [{'Time': hour:min, 'count': {'ai': xxx, 'data': xxx, 'good': xxx, 'movie': xxx, 'spark': xxx}},
                  {'Time': hour:min, 'count': {'ai': xxx, 'data': xxx, 'good': xxx, 'movie': xxx, 'spark': xxx}},
                  ...
                  ]
        }
    '''

    return render(request, 'dashboard.html', data)


def connection(request):
    pandas_gbq.context.credentials = credentials
    pandas_gbq.context.project = "linen-surface-252923"
    SQL1 = 'select * from hw4.nodes'
    df1 = pandas_gbq.read_gbq(SQL1)
    tmp1 = df1.values
    node = []
    for i in range(len(tmp1)):
        node.append({'node': tmp1[i][0]})
    #print(node)
    SQL2 = 'select * from hw4.edges'
    df2 = pandas_gbq.read_gbq(SQL2)
    tmp2 = df2.values
    edge = []
    for i in range(len(tmp2)):
        edge.append({'source': tmp2[i][0], 'target': tmp2[i][1]})
    #print(edge)
    data = {'n': node, 'e': edge}

    '''
        TODO: Finish the SQL to query the data, it should be limited to 8 rows. 
        Then process them to format below:
        Format of data:
        {'n': [xxx, xxx, xxx, xxx],
         'e': [{'source': xxx, 'target': xxx},
                {'source': xxx, 'target': xxx},
                ...
                ]
        }
    '''
    return render(request, 'connection.html', data)
