/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Demo } from "../../../../types/types";
import { MarcaService } from "../../../demo/service/cadastro/BaseService";

const CrudMarcas = () => {
  let emptyObject: Demo.Marca = {
    nome: "",
  };

  const [objects, setObjects] = useState<Demo.Marca[]>([]);
  const [objectDialog, setObjectDialog] = useState(false);
  const [deleteObjectDialog, setDeleteObjectDialog] = useState(false);
  const [deleteObjectsDialog, setDeleteObjectsDialog] = useState(false);
  const [object, setObject] = useState<Demo.Marca>(emptyObject);
  const [selectedObjects, setSelectedObjects] = useState<Demo.Marca[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Demo.Marca[]>>(null);

  useEffect(() => {
    if (objects.length === 0) {
      MarcaService.getAll().then((data) => (data ? setObjects(data) : null));
    }
  }, [objects]);

  const openNew = () => {
    setObject(emptyObject);
    setSubmitted(false);
    setObjectDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setObjectDialog(false);
  };

  const hideDeleteObjectDialog = () => {
    setDeleteObjectDialog(false);
  };

  const hideDeleteObjectsDialog = () => {
    setDeleteObjectsDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (object.nome.trim()) {
      let _objects = [...objects];
      let _object = { ...object };
      if (object.id) {
        const index = findIndexById(object.id);

        await MarcaService.update(_object)
          .then((data) => {
            if (!data) {
              return toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao Atualizar Marca",
                life: 3000,
              });
            }

            _object = data;
            _objects[index] = _object;

            toast.current?.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Marca Atualizado",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error: ", error);

            return toast.current?.show({
              severity: "error",
              summary: "Erro",
              detail: `Erro ao Atualizar Marca: ${error}`,
              life: 3000,
            });
          });
      } else {
        await MarcaService.create(_object)
          .then((data) => {
            if (!data) {
              return toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao Criar Marca",
                life: 3000,
              });
            }

            _object = data;
            _objects.push(_object);

            toast.current?.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Marca Criado",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error: ", error);

            return toast.current?.show({
              severity: "error",
              summary: "Erro",
              detail: `Erro ao Criar Marca: ${error}`,
              life: 3000,
            });
          });
      }

      setObjects(_objects);
      setObjectDialog(false);
      setObject(emptyObject);
    }
  };

  const editProduct = (product: Demo.Marca) => {
    setObject({ ...product });
    setObjectDialog(true);
  };

  const confirmDeleteProduct = (product: Demo.Marca) => {
    setObject(product);
    setDeleteObjectDialog(true);
  };

  const deleteProduct = async () => {
    let _objects = [...objects];
    let _object = { ...object };

    if (_object.id) {
      const index = findIndexById(_object.id);

      await MarcaService.delete(_object.id)
        .then((ok) => {
          if (index !== -1 && ok) {
            _objects.splice(index, 1);

            toast.current?.show({
              severity: "success",
              summary: "Sucesso",
              detail: "Marca Deletado",
              life: 3000,
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Erro",
              detail: "Erro ao Deletar Marca.",
              life: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error: ", error);

          return toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: `Erro ao Deletar Marca: ${error}`,
            life: 3000,
          });
        });
      setObjects(_objects);
      setObject(emptyObject);
      setDeleteObjectDialog(false);
    }
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteObjectsDialog(true);
  };

  const deleteSelectedProducts = async () => {
    // Assuming selectedObjects is an array of selected product objects
    if (!Array.isArray(selectedObjects) || selectedObjects.length === 0) {
      console.error("selectedObjects must be an array and cannot be empty");
      return;
    }

    // Extract the ids of the selected objects
    const selectedProductIds = selectedObjects.map((product) => product.id as number);

    try {
      // Call the bulkDelete method of MarcaService
      await MarcaService.bulkDelete(selectedProductIds).then((ok) => {
        if (ok) {
          const _objects = objects.filter(
            (object) => !selectedProductIds.includes(object.id as number)
          );
          setObjects(_objects);

          toast.current?.show({
            severity: "success",
            summary: "Sucesso",
            detail: "Marcas Deletados",
            life: 3000,
          });

          setSelectedObjects([]);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao Deletar Marcas.",
            life: 3000,
          });
        }
      });
    } catch (error) {
      console.error("An error occurred while deleting the products: ", error);

      return toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: `Erro ao Deletar Marcas: ${error}`,
        life: 3000,
      });
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: keyof Demo.Marca
  ) => {
    const val = (e.target && e.target.value) || "";
    let _object = { ...object };
    _object[`${name}`] = val as never;

    setObject(_object);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className=" mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedObjects || !selectedObjects.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Export"
          icon="pi pi-upload"
          severity="help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const codeBodyTemplate = (rowData: Demo.Marca) => {
    return (
      <>
        <span className="p-column-title">ID</span>
        {rowData.id ?? ""}
      </>
    );
  };

  const nameBodyTemplate = (rowData: Demo.Marca) => {
    return (
      <>
        <span className="p-column-title">Nome</span>
        {rowData.nome}
      </>
    );
  };

  const actionBodyTemplate = (rowData: Demo.Marca) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Gerencie Marcas</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
    </>
  );
  const deleteObjectDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteObjectDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
    </>
  );
  const deleteObjectsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteObjectsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedProducts}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={objects}
            selection={selectedObjects}
            onSelectionChange={(e) =>
              setSelectedObjects(e.value as Demo.Marca[])
            }
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} ate {last} de {totalRecords} marcas"
            globalFilterFields={["nome", "sigla", "id"]}
            globalFilter={globalFilter}
            emptyMessage="Nenhum Marca encontrado."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "1rem" }}
            ></Column>
            <Column
              field="id"
              header="ID"
              sortable
              body={codeBodyTemplate}
              headerStyle={{ minWidth: "1rem" }}
            ></Column>
            <Column
              field="nome"
              header="Nome"
              sortable
              body={nameBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              header="Açoes"
              align="center"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "1rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={objectDialog}
            style={{ width: "450px" }}
            header="Detalhes do Marca"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <InputText
                id="nome"
                value={object.nome}
                onChange={(e) => onInputChange(e, "nome")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !object.nome,
                })}
              />
              {submitted && !object.nome && (
                <small className="p-invalid">Nome e obrigatorio.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteObjectDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteObjectDialogFooter}
            onHide={hideDeleteObjectDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {object && (
                <span>
                  Tem certeza que deseja deletar <b>{object.nome}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteObjectsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteObjectsDialogFooter}
            onHide={hideDeleteObjectsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {object && (
                <span>
                  Tem certeza que deseja deletar os marcas selecionados ?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CrudMarcas;
