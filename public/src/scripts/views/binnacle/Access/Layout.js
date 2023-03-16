// @filename: Layout.ts
export const UIContentLayout = `
    <div class="datatable" id="datatable">
        <div class="datatable_header">
            <div class="datatable_title"><h1 id="view-title"></h1></div>

            <div class="datatable_tools" id="datatable-tools">
                <input type="search" class="search_input" placeholder="Buscar" id="search">

                <button class="datatable_button import_user" id="import-entities">Exportar</button>
            </div>
        </div>

        <table class="datatable_content">
        <thead><tr>
            <th><span data-type="name">
            Nombre <i class="fa-regular fa-filter"></i>
            </span></th>

            <th><span data-type="CI">
            CI <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=100><span data-type="start">
            Inicio <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=120><span data-type="end">
            Fin <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=110><span data-type="state">
            Estado <i class="fa-regular fa-filter"></i>
            </span></th>

            <th class="thead_centered" width=120><span data-type="details">
            Detalles
            </span></th>

        </tr></thead>
        <tbody id="datatable-body" class="datatable_body">

        </tbody>
        </table>

        <div class="datatable_footer">
        <div class="datatable_pagination" id="pagination-container"></div>
        </div>
    </div>`;
export const UIRightSidebar = '';
